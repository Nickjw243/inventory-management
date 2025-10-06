from flask import make_response, request, jsonify, render_template
from flask_jwt_extended import (
    create_access_token,
    get_jwt_identity,
    jwt_required,
)

from config import app, db, api
from models import Brands, Products, DistributionCenter, Inventory, User

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
            'dcs': '/api/dcs',
            'dc_inventory': '/api/dcs/<id>/inventory',
            'auth_register': '/api/auth/register',
            'auth_login': '/api/auth/login',
            'me': '/api/auth/me'
        }
    })
    
# Brand endpoints
@app.route('/api/brands', methods=['GET'])
def get_brands():
    """Get all brands"""
    brands = Brands.query.all()
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
    data = request.get_json() or {}
    if 'amount' not in data:
        return jsonify({'error': 'Amount is required'}), 400
    amount = data['amount']
    action = data.get('action', 'add')
    inv_count = Inventory.query.filter_by(product_id=product.id).count()
    if inv_count > 0:
        return jsonify({'error': 'Per-DC inventory exists. Use /api/dcs/<dc_id>/inventory/<product_id>/adjust'}), 400
    if action == 'add':
        product.stock += amount
    elif action == 'subtract':
        if product.stock - amount < 0:
            return jsonify({'error': 'Insufficient stock'}), 400
        product.stock -= amount
    else:
        return jsonify({'error': 'Action must be add or subtract'}), 400
    try:
        db.session.commit()
        return jsonify({'message': f'Stock {action}ed successfully', 'new_stock': product.stock})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400
    
@app.route('/api/dcs/<int:dc_id>/low-stock', methods=['GET'])
def get_low_stock_products_for_dc(dc_id):
    """Get products with low stock"""
    threshold = request.args.get('threshold', 10, type=int)
    inventories = Inventory.query.filter(
        Inventory.distribution_center_id == dc_id,
        Inventory.quantity < threshold
    ).all()
    products_dict = [inv.to_dict() for inv in inventories]
    return jsonify(products_dict)

# @app.route('/api/inventory/summary', methods=['GET'])
# def get_inventory_summary():
#     """Get inventory summary statistics"""
#     total_products = Products.query.count()
#     total_stock = db.session.query(db.func.sum(Inventory.quantity)).scalar()
#     if total_stock is None:
#         total_stock = db.session.query(db.func.sum(Products.stock)).scalar() or 0
#     low_stock_count = Products.query.filter(Products.stock < 10).count()
#     total_brands = Brands.query.count()
    
#     return jsonify({
#         'total_products': total_products,
#         'total_stock_value': float(total_stock),
#         'low_stock_items': low_stock_count,
#         'total_brands': total_brands
#     })
    
@app.route("/api/dcs/<int:dc_id>/summary", methods=['GET'])
def get_dc_summary(dc_id):
    dc = DistributionCenter.query.get(dc_id)
    if not dc:
        return jsonify({"error": "Distribution center not found"}), 404
    
    inventories = Inventory.query.filter_by(distribution_center_id=dc_id).all()
    total_products = len(inventories)
    total_stock = sum(inv.quantity for inv in inventories)
    low_stock_count = sum(1 for inv in inventories if inv.quantity < 10)
    total_brands = len(set(inv.product.brand_id for inv in inventories))
    
    return jsonify({
        'total_products': total_products,
        'total_stock_value': total_stock,
        'low_stock_items': low_stock_count,
        'total_brands': total_brands
    })
    
# Distribution Centers
@app.route('/api/dcs', methods=['GET'])
def list_dcs():
    dcs = DistributionCenter.query.all()
    return jsonify([dc.to_dict() for dc in dcs])

@app.route('/api/dcs/<int:dc_id>/inventory', methods=['GET'])
def dc_inventory(dc_id):
    dc = DistributionCenter.query.get_or_404(dc_id)
    inventories = Inventory.query.filter_by(distribution_center_id=dc.id).all()
    result = []
    for inv in inventories:
        item = inv.to_dict(rules=('-product.brand.products', '-distribution_center'))
        item['product'] = inv.product.to_dict(rules=('-brand.products', '-inventories'))
        result.append(item)
    return jsonify({
        'distribution_center': dc.to_dict(),
        'inventory': result
    })
    
@app.route('/api/dcs/<int:dc_id>/inventory/<int:product_id>/adjust', methods=['POST'])
def adjust_dc_inventory(dc_id, product_id):
    dc = DistributionCenter.query.get_or_404(dc_id)
    product = Products.query.get_or_404(product_id)
    data = request.get_json() or {}
    amount = data.get('amount')
    action = data.get('action', 'add')
    if amount is None:
        return jsonify({'error': 'amount is required'}), 400
    inv = Inventory.query.filet_by(distribution_center_id = dc.id, product_id=product.id).first()
    if not inv:
        inv = Inventory(distribution_center_id=dc.id, product_id=product.id, quantity=0)
        db.session.add(inv)
    if action == 'add':
        inv.quantity += amount
    elif action == 'subtract':
        if inv.quantity - amount < 0:
            return jsonify({'error': 'Insufficient stock at DC'}), 400
        inv.quantity -= amount
    else:
        return jsonify({'error': 'action must be add or subtract'}), 400
    try:
        db.sesson.commit()
        return jsonify(inv.to_dict())
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400
    
@app.route('/api/dcs/transfer', methods=['POST'])
def transfer_between_dcs():
    data = request.get_json() or {}
    product_id = data.get('product_id')
    from_dc_id = data.get('from_dc_id')
    to_dc_id = data.get('to_dc_id')
    amount = data.get('amount')
    if not all([product_id, from_dc_id, to_dc_id, amount]):
        return jsonify({'error': 'product_id, from_dc_id, to_dc_id, amount are required'}), 400
    if from_dc_id == to_dc_id:
        return jsonify({'error': 'from and to DC must be different'}), 400
    product = Products.query.get_or_404(product_id)
    from_dc = DistributionCenter.query.get_or_404(from_dc_id)
    to_dc = DistributionCenter.query.get_or_404(to_dc_id)
    from_inv = Inventory.query.filter_by(distribution_center_id=from_dc.id, product_id=product.id).first()
    if not from_inv or from_inv.quantity < amount:
        return jsonify({'error': 'Insufficient stock at source DC'}), 400
    to_inv = Inventory.query.filter_by(distribution_center_id=to_dc.id, product_id=product.id).first()
    if not to_inv:
        to_inv = Inventory(distribution_center_id=to_dc.id, product_id=product.id, quantity=0)
        db.session.add(to_inv)
    from_inv.quantity -= amount
    to_inv.quantity += amount
    try:
        db.session.commit()
        return jsonify({'message': 'Transfer complete'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400
    
# Auth endpoints
@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.get_json() or {}
    username = data.get('username')
    password = data.get('password')
    dc_id = data.get('distribution_center_id')
    if not username or not password:
        return jsonify({'error': 'username and password are required'}), 400
    if User.query.filter_by(username=username).first():
        return jsonify({'error': 'username already exists'}), 400
    user = User(username=username, password_hash=_hash_password(password), distribution_center_id=dc_id)
    db.session.add(user)
    try:
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400
    token = create_access_token(identity={'id': user.id, 'username': user.username})
    return jsonify({'access_token': token})

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json() or {}
    username = data.get('username')
    password = data.get('password')
    if not username or not password:
        return jsonify({'error': 'username and password are required'}), 400
    user = User.query.filter_by(username=username).first()
    if not user or not _verify_password(password, user.password_hash):
        return jsonify({'error': 'invalid credentials'}), 401
    token = create_access_token(identity={'id': user.id, 'username': user.username})
    return jsonify({'access_token': token})

@app.route('/api/auth/me', methods=['GET'])
@jwt_required()
def me():
    ident = get_jwt_identity() or {}
    user = User.query.get_or_404(ident.get('id'))
    return jsonify(user.to_dict())

# Helpers
from werkzeug.security import generate_password_hash, check_password_hash

def _hash_password(password):
    return generate_password_hash(password)

def _verify_password(password, password_hash):
    return check_password_hash(password_hash, password)

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