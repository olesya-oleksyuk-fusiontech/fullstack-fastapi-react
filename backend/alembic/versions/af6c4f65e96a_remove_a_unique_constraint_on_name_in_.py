"""remove a unique constraint on Name in the Product table

Revision ID: af6c4f65e96a
Revises: aee06e2aaf0d
Create Date: 2023-05-02 11:10:20.383805

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'af6c4f65e96a'
down_revision = 'aee06e2aaf0d'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_index('name', table_name='product')
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_index('name', 'product', ['name'], unique=False)
    # ### end Alembic commands ###
