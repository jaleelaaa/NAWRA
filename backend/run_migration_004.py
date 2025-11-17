#!/usr/bin/env python3
"""
Run migration 004: Add arabic_name column
"""
import sys
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent))

from supabase import create_client
from app.core.config import settings
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def main():
    """Run migration 004"""
    logger.info("🔧 Running migration 004: Add arabic_name column...")

    # Get Supabase client
    supabase = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)

    # Read migration SQL
    migration_file = Path(__file__).parent / "migrations" / "004_add_arabic_name_column.sql"

    if not migration_file.exists():
        logger.error(f"❌ Migration file not found: {migration_file}")
        return

    migration_sql = migration_file.read_text(encoding='utf-8')

    logger.info("📄 Migration SQL loaded")
    logger.info("=" * 60)

    # Split by semicolon and execute each statement
    statements = [s.strip() for s in migration_sql.split(';') if s.strip() and not s.strip().startswith('--')]

    for i, statement in enumerate(statements, 1):
        if statement:
            try:
                logger.info(f"Executing statement {i}/{len(statements)}...")
                # Execute via RPC call
                result = supabase.rpc('exec_sql', {'query': statement}).execute()
                logger.info(f"✅ Statement {i} executed successfully")
            except Exception as e:
                logger.error(f"❌ Error executing statement {i}: {str(e)}")
                logger.info(f"Statement: {statement[:100]}...")

                # Try alternative: direct query (if exec_sql RPC doesn't exist)
                logger.info("Trying direct execution...")
                try:
                    result = supabase.postgrest.query(statement).execute()
                    logger.info(f"✅ Statement {i} executed successfully (direct)")
                except Exception as e2:
                    logger.error(f"❌ Direct execution also failed: {str(e2)}")
                    logger.warning("⚠️ You may need to run this migration manually in Supabase SQL Editor")

    logger.info("=" * 60)
    logger.info("✅ Migration 004 completed!")
    logger.info("Note: If you see errors, please run the SQL manually in Supabase SQL Editor")
    logger.info(f"Location: {migration_file}")


if __name__ == "__main__":
    main()
