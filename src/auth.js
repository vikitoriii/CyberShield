export async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + 'cybershield_salt_2024');
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function verifyPassword(password, hash) {
  const passwordHash = await hashPassword(password);
  return passwordHash === hash;
}

export function validateUsername(username) {
  if (!username) return 'Введите имя агента';
  if (username.length < 3) return 'Минимум 3 символа';
  if (username.length > 20) return 'Максимум 20 символов';
  if (!/^[a-zA-Z0-9_]+$/.test(username)) return 'Только латиница, цифры и _';
  if (/^[\d_]/.test(username)) return 'Не может начинаться с цифры или _';
  return null;
}

export function validatePassword(password) {
  if (!password) return 'Введите пароль';
  if (password.length < 6) return 'Минимум 6 символов';
  if (password.length > 50) return 'Максимум 50 символов';
  if (!/[A-Za-z]/.test(password)) return 'Хотя бы одна буква';
  if (!/\d/.test(password)) return 'Хотя бы одна цифра';
  return null;
}

export function validateEmail(email) {
  if (!email) return null;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Некорректный email';
  return null;
}
