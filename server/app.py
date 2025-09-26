from flask import make_response, request, jsonify, render_template
# from flask_jwt_extended import {
#     create_access_token,
#     get_jwt_identity,
#     jwt_required,
# }

from config import app, db, api
from models import Brands, Products

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/api')
def api_info():
    return jsonify({
        'message': 'Inventory Management API',
        'version': '1.0.0',
        'endpoints': {
            'brands': '/api/brands',
            'products': '/api/products',
            'low_stock': '/api/products/low-stock',
            'summary': '/api/inventory/summary',
            # 'dcs': '/api/dcs',
            # 'dc_inventory': '/api/dcs/<id>/inventory',
            # 'auth_register': '/api/auth/register',
            # 'auth_login': '/api/auth/login',
            # 'me': '/api/auth/me'
        }
    })
    
# Brand endpoints
@app.route('/api/brands', methods=['GET'])
def get_brands():
    """Get all brands"""
    print("Brands type:", Brands)
    brands = Brands.query.all()
    print("Brands.query result:", brands)
    brands_dict = [brand.to_dict(rules=('-products',)) for brand in brands]
    response = make_response(
        brands_dict,
        200
    )
    return response

@app.route('/api/brands', methods=['POST'])
def create_brand():
    """Create a new brand"""
    data = request.get_json()
    
    if not data or not data.get('name'):
        return jsonify({'error': 'Name is required'}), 400
    
    brand = Brands(
        name=data['name'],
        country=data.get('country', ''),
        description=data.get('description', '')
    )
    
    try:
        db.session.add(brand)
        db.session.commit()
        return jsonify(brand.to_dict(rules=('-products',))), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400
    
@app.route('/api/brands/<int:brand_id>', methods=['GET'])
def get_brand(brand_id):
    """Get a specific brand"""
    brand = Brands.query.get_or_404(brand_id)
    return jsonify(brand.to_dict(rules=('-products',)))

@app.route('/api/brands/<int:brand_id>', methods=['PUT'])
def update_brand(brand_id):
    """Update a brand"""
    brand = Brands.query.get_or_404(brand_id)
    data = request.get_json()
    
    if not data:
        return jsonify({'error': 'No data provided'}), 400
    
    brand.name = data.get('name', brand.name)
    brand.country = data.get('country', brand.country)
    brand.description = data.get('description', brand.description)
    
    try:
        db.session.commit()
        return jsonify(brand.to_dict(rules=('-products',)))
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400
    
@app.route('/api/brands/<int:brand_id>', methods=['DELETE'])
def delete_brand(brand_id):
    """Delete a brand"""
    brand = Brands.query.get_or_404(brand_id)
    
    try:
        db.session.delete(brand)
        db.session.commit()
        return jsonify({'message': 'Brand deleted successfully'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400
    
# Product endpoints
@app.route('/api/products', methods=['GET', 'POST'])
def products():
    if request.method == 'GET':
        """Get all products with optional filtering"""
        brand_id = request.args.get('brand_id', type=int)
        low_stock = request.args.get('low_stock', type=bool)
        
        query = Products.query
        
        if brand_id:
            query = query.filter_by(brand_id=brand_id)
        if low_stock:
            query = query.filter(Products.stock < 10)
            
        products = query.all()
        products_dict = [product.to_dict(rules=('-brand.products',)) for product in products]
        return jsonify(products_dict)
    elif request.method == 'POST':
        """Create new product"""
        data = request.get_json()
        
        required_fields = ['name', 'sku', 'brand_id', 'price', 'stock']
        for field in required_fields:
            if not data or not data.get(field):
                return jsonify({'error': f'{field} is required'}), 400
        
        product = Products(
            name=data['name'],
            sku=data['sku'],
            brand_id=data['brand_id'],
            package_size=data.get('package_size', ''),
            price=data['price'],
            type=data.get('type', ''),
            abv=data.get('abv', 0.0),
            stock=data['stock']
        )
        
        try:
            db.session.add(product)
            db.session.commit()
            return jsonify(product.to_dict(rules=('-brand.products',))), 201
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': str(e)}), 400

@app.route('/api/products/<int:product_id>', methods=['GET'])
def get_product(product_id):
    """Get a specific product"""
    product = Products.query.filter(Products.id == product_id)
    
    if product:
        response = make_response(product.to_dict(), 200)
    else:
        response = make_response({'error': 'Product not found'}, 404)
    
    return response

@app.route('/api/products/<int:product_id>', methods=['PUT'])
def update_product(product_id):
    """Update a product"""
    product = Products.query.get_or_404(product_id)
    data = request.get_json()
    
    if not data:
        return jsonify({'error': 'No data provided'}), 400
    
    # Update fields
    for field in ['name', 'sku', 'brand_id', 'package_size', 'price', 'type', 'abv', 'stock']:
        if field in data:
            setattr(product, field, data[field])
    
    try:
        db.session.commit()
        return jsonify(product.to_dict(rules=('-brand.products',)))
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

@app.route('/api/products/<int:product_id>', methods=['DELETE'])
def delete_product(product_id):
    """Delete a product"""
    product = Products.query.get_or_404(product_id)
    
    try:
        db.session.delete(product)
        db.session.commit()
        return jsonify({'message': 'Product deleted successfullly'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

# Inventory management endpoints
@app.route('/api/products/<int:product_id>/adjust-stock', methods=['POST'])
def adjust_stock(product_id):
    """Adjust product stock (add or subtract)"""
    product = Products.query.get_or_404(product_id)
    data = request.get_json()
    
    if not data or 'amount' not in data:
        return jsonify({'error': 'Amount is required'}), 400
    
    amount = data['amount']
    action = data.get('action', 'add')  # add or subtract
    
    if action == 'add':
        product.stock += amount
    elif action == 'subtract':
        if product.stock - amount < 0:
            return jsonify({'error': 'Insufficient stock'}), 400
        product.stock -= amount
    else:
        return jsonify({'error': 'Action must be "add" or "subtract"'}), 400
    
    try:
        db.session.commit()
        return jsonify({
            'message': f'Stock {action}ed successfully',
            'new_stock': product.stock
        })
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400
    
@app.route('/api/products/low-stock', methods=['GET'])
def get_low_stock_products():
    """Get products with low stock"""
    threshold = request.args.get('threshold', 10, type=int)
    products = Products.query.filter(Products.stock < threshold).all()
    products_dict = [product.to_dict(rules=('-brand.products',)) for product in products]
    return jsonify(products_dict)

@app.route('/api/inventory/summary', methods=['GET'])
def get_inventory_summary():
    """Get inventory summary statistics"""
    total_products = Products.query.count()
    total_stock = db.session.query(db.func.sum(Products.stock)).scalar() or 0
    low_stock_count = Products.query.filter(Products.stock < 10).count()
    total_brands = Brands.query.count()
    
    return jsonify({
        'total_products': total_products,
        'total_stock_value': float(total_stock),
        'low_stock_items': low_stock_count,
        'total_brands': total_brands
    })

# Error handling
@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Resource not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    db.session.rollback()
    return jsonify({'error': 'Internal server error'}), 500


if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(host='0.0.0.0', port=5500, debug=True)