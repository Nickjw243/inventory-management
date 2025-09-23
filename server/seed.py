from config import app, db
from models import Brands, Products

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
        
        print("Database seeded successfully!")