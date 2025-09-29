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
    inventories = db.relationship('Inventory', back_populates='product', cascade='all, delete-orphan')
    
    # serialize rules
    serialize_rules = ('-brand.products', '-inventories.product')
    
    # @property
    # def total_stock(self):
    #     total = sum(inv.quantity for inv in self.inventories) if self.inventories else 0
    #     # Fallback to legacy stock field if no per-DC inventories exist
    #     return total if total is not None and total > 0 else (self.stock or 0)
    
class DistributionCenter(db.Model, SerializerMixin):
    __tablename__ = 'distribution_centers'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, unique=True, nullable=False)
    code = db.Column(db.String, unique=True, nullable=False)
    city = db.Column(db.String, nullable=False)
    state = db.Column(db.String, nullable=False)
    
    inventories = db.relationship('Inventory', back_populates='distribution_center', cascade='all, delete-orphan')
    users = db.relationship('User', back_populates='distribution_center')
    
    serialize_rules = ('-inventories.distribution_center', '-users.distribution_center',)
    
class Inventory(db.Model, SerializerMixin):
    __tablename__ = 'inventories'
    
    id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False)
    distribution_center_id = db.Column(db.Integer, db.ForeignKey('distribution_centers.id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False, default=0)
    
    product = db.relationship('Products', back_populates='inventories')
    distribution_center = db.relationship('DistributionCenter', back_populates='inventories')
    
    # __table_args__ = (
    #     db.UniqueConstraint('product_id', 'distribution_center_id', name='uq_product_dc'),
    # )
    
    serialize_rules = ('-product.inventories', '-distribution_center.inventories',)
    
class User(db.Model, SerializerMixin):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, unique=True, nullable=False)
    password_hash = db.Column(db.String, nullable=False)
    distribution_center_id = db.Column(db.Integer, db.ForeignKey('distribution_centers.id'))
    role = db.Column(db.String, nullable=False, default='user')
    
    distribution_center = db.relationship('DistributionCenter', back_populates='users')
    
    serialize_rules = ('-password_hash', '-distribution_center.users', )