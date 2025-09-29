from config import app, db
from models import Brands, Products, DistributionCenter, Inventory, User
from werkzeug.security import generate_password_hash

if __name__ == '__main__':
    with app.app_context():
        print('Resetting database...')
        db.drop_all()
        db.create_all()
        
        print('Seeding database...')
        
        print('Seeding brands...')
        brands = [
            Brands(
                name="Budweiser",
                country="United States",
                description="America's most popular beer brand"
            ),
            Brands(
                name="Corona",
                country="Mexico",
                description="Premium Mexican beer with lime"
            ),
            Brands(
                name='Heineken',
                country='Netherlands',
                description="International premium lager"
            ),
            Brands(
                name="Stella Artois",
                country="Belgium",
                description="Belgian premium pilsner"
            ),
            Brands(
                name="Guinness",
                country="Ireland",
                description="Dark Irish stout"
            )
        ]
        db.session.add_all(brands)
        db.session.commit()
        
        print("Seeding products...")
        products = [
            Products(
                name="Budweiser",
                brand_id=1,
                sku="BUD-ORIG-12PK",
                package_size="12 oz",
                price=1.99,
                type="Lager",
                abv=5.0,
                stock=100
            ),
            Products(
                name="Corona Extra",
                brand_id=2,
                sku="COR-EXTRA-12PK",
                package_size="12 Pack",
                price=14.99,
                type="Pale Lager",
                abv=4.5,
                stock=30
            ),
            Products(
                name="Corona Light",
                brand_id=2,
                sku="COR-LIGHT-12PK",
                package_size="12 Pack",
                price=13.99,
                type="Light Lager",
                abv=4.1,
                stock=25
            ),
            Products(
                name="Heineken Lager",
                brand_id=3,
                sku="HEIN-LAG-12PK",
                package_size="12 Pack",
                price=15.99,
                type="European Lager",
                abv=5.0,
                stock=40
            ),
            Products(
                name="Stella Artois",
                brand_id=4,
                sku="STELLA-12PK",
                package_size="12 Pack",
                price=16.99,
                type="European Pilsner",
                abv=5.2,
                stock=35
            ),
            Products(
                name="Guinness Draught",
                brand_id=5,
                sku="GUIN-DRAUGHT-6PK",
                package_size="6 Pack",
                price=9.99,
                type="Stout",
                abv=4.2,
                stock=20
            ),
            Products(
                name="Budweiser King Size",
                brand_id=1,
                sku="BUD-KING-24PK",
                package_size="24 Pack",
                price=19.99,
                type="Lager",
                abv=5.0,
                stock=15
            ),
            Products(
                name="Corona Premier",
                brand_id=2,
                sku="COR-PREM-12PK",
                package_size="12 Pack",
                price=15.99,
                type="Light Lager",
                abv=4.0,
                stock=8  # Low stock item
            ),
            Products(
                name="Heineken 0.0",
                brand_id=3,
                sku="HEIN-00-12PK",
                package_size="12 Pack",
                price=14.99,
                type="Non-Alcoholic",
                abv=0.0,
                stock=5  # Low stock item
            )
        ]
        db.session.add_all(products)
        db.session.commit()
        
        print("Seeding distribution centers...")
        dcs = [
            DistributionCenter(
                name='Northeast DC',
                code='NE',
                city='Newark',
                state='NJ'
            ),
            DistributionCenter(
                name='Southeast DC', 
                code='SE', 
                city='Atlanta', 
                state='GA'
            ),
            DistributionCenter(
                name='Midwest DC', 
                code='MW', 
                city='Chicago', 
                state='IL'
            ),
            DistributionCenter(
                name='Southwest DC', 
                code='SW', 
                city='Dallas', 
                state='TX'
            ),
            DistributionCenter(
                name='West DC', 
                code='WE', 
                city='Los Angeles', 
                state='CA'
            ),
        ]
        db.session.add_all(dcs)
        db.session.commit()
        
        print("Seeding per-DC inventory...")
        # Simple varying quantities across DCs
        all_products = Products.query.all()
        base_quantities = [40, 30, 20, 10, 5]
        for idx, dc in enumerate(dcs):
            for p in all_products:
                qty = max(0, (p.stock // 5) + base_quantities[idx] - (p.id % 7))
                db.session.add(Inventory(product_id=p.id, distribution_center_id=dc.id, quantity=qty))
        db.session.commit()

        print("Creating sample users assigned to DCs...")
        users = [
            User(username='manager_ne', password_hash=generate_password_hash('password'), distribution_center_id=dcs[0].id, role='manager'),
            User(username='manager_se', password_hash=generate_password_hash('password'), distribution_center_id=dcs[1].id, role='manager'),
            User(username='manager_mw', password_hash=generate_password_hash('password'), distribution_center_id=dcs[2].id, role='manager'),
        ]
        db.session.add_all(users)
        db.session.commit()
        
        print("Database seeded successfully!")