"""add "generation" column to leaderboard

Revision ID: d71af8dc8364
Revises: fdace54819bf
Create Date: 2017-07-11 10:38:20.745295

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'd71af8dc8364'
down_revision = 'fdace54819bf'
branch_labels = None
depends_on = None


def upgrade():
    op.add_column('leaderboard', sa.Column('generation', sa.Integer(),
                                           nullable=True))

    # fill generation column with data so that we can make is non-nullable
    op.execute('UPDATE leaderboard SET generation=1')

    op.alter_column('leaderboard', 'initials',
               existing_type=sa.VARCHAR(),
               nullable=False)
    op.alter_column('leaderboard', 'score',
               existing_type=sa.INTEGER(),
               nullable=False)
    op.alter_column('leaderboard', 'generation',
                    existing_type=sa.INTEGER(),
                    nullable=False)


def downgrade():
    op.alter_column('leaderboard', 'score',
               existing_type=sa.INTEGER(),
               nullable=True)
    op.alter_column('leaderboard', 'initials',
               existing_type=sa.VARCHAR(),
               nullable=True)
    op.drop_column('leaderboard', 'generation')
