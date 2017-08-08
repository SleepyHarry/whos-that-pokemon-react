"""Initial db build

Revision ID: fdace54819bf
Revises: 
Create Date: 2017-07-10 22:50:14.083860

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'fdace54819bf'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    op.create_table('leaderboard',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('score', sa.Integer(), nullable=True),
    sa.Column('initials', sa.String(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )


def downgrade():
    op.drop_table('leaderboard')
