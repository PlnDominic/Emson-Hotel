import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
import os

def setup_database():
    try:
        # Connect to PostgreSQL server
        conn = psycopg2.connect(
            dbname='Lavimac',
            user='postgres',
            password='1234',
            host='localhost'
        )
        conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        
        # Create a cursor
        cur = conn.cursor()
        
        # Read SQL commands from file
        script_path = os.path.join(os.path.dirname(__file__), 'create_tables.sql')
        with open(script_path, 'r') as sql_file:
            sql_commands = sql_file.read()
        
        # Execute SQL commands
        cur.execute(sql_commands)
        
        print("Database tables created successfully!")
        
        # Close cursor and connection
        cur.close()
        conn.close()
        
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == '__main__':
    setup_database()
