from sqlalchemy_serializer import SerializerMixin

from config import db

class Brands(db.Model, SerializerMixin):
    __tablename__ = 'brands'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, unique=True, nullable=False)
    country = db.Column(db.String, nullable=False)
    description = db.Column(db.String, nullable=False)
    
    # relationships
    products = db.relationship('Products', back_populates='brand')
    
    # serialize rules
    serialize_rules = ('-products.brand',)
    
class Products(db.Model, SerializerMixin):
    __tablename__ = 'products'
    
    id = db.Column(db.Integer, primary_key=True)
    brand_id = db.Column(db.Integer, db.ForeignKey('brands.id'), nullable=False)
    name = db.Column(db.String, nullable=False)
    sku = db.Column(db.String, nullable=False)
    package_size = db.Column(db.String, nullable=False)
    price = db.Column(db.Float, nullable=False)
    type = db.Column(db.String, nullable=False)
    abv = db.Column(db.Float, nullable=False)
    stock = db.Column(db.Integer, nullable=False)
    
    # relationships
    brand = db.relationship('Brands', back_populates='products')
    
    # serialize rules
    serialize_rules = ('-brand.products',)