"""add delivered_at to Order table & change created_on to created_at

Revision ID: 926210adb3cb
Revises: 12f0ed5ff11d
Create Date: 2023-05-04 14:21:54.545884

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql

# revision identifiers, used by Alembic.
revision = '926210adb3cb'
down_revision = '12f0ed5ff11d'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('order', sa.Column('created_at', sa.TIMESTAMP(), nullable=True))
    op.add_column('order', sa.Column('delivered_at', sa.TIMESTAMP(), nullable=True))
    op.drop_column('order', 'created_on')
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('order', sa.Column('created_on', mysql.TIMESTAMP(), nullable=True))
    op.drop_column('order', 'delivered_at')
    op.drop_column('order', 'created_at')
    # ### end Alembic commands ###
