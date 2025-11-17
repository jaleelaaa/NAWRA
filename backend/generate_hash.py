"""
Generate bcrypt password hash for: Nawra2025!
"""
import bcrypt

password = "Nawra2025!"
password_bytes = password.encode('utf-8')

# Generate hash with 12 rounds (standard)
salt = bcrypt.gensalt(rounds=12)
hashed = bcrypt.hashpw(password_bytes, salt)

print(f"Password: {password}")
print(f"Hash: {hashed.decode('utf-8')}")
print(f"\nVerification test:")
print(f"Valid: {bcrypt.checkpw(password_bytes, hashed)}")
