# CI/CD Deployment Documentation

Configure os **Secrets** em Settings → Secrets and variables → Actions:
- `SSH_HOST` = 72.60.5.89
- `SSH_USER` = usuário SSH (ex.: ubuntu/root)
- `SSH_KEY` = chave privada (PEM)
- `REMOTE_PATH` = /var/www/html/sistema-entrega

**Rodando manualmente:** Actions → Deploy Flora → Run workflow (branch main).

**Paths/URLs:**
- Loja → /var/www/html/sistema-entrega/loja-virtual/ → http://72.60.5.89/
- Admin → /var/www/html/sistema-entrega/admin-frontend/ → http://72.60.5.89/admin
- API → /var/www/html/sistema-entrega/backend-api/ → http://72.60.5.89:3000/api/...

**SPA fallback (Nginx):**


location / {
root /var/www/html/sistema-entrega/loja-virtual/;
index index.html;
try_files $uri $uri/ /index.html;
}
location /admin {
alias /var/www/html/sistema-entrega/admin-frontend/;
index index.html;
try_files $uri $uri/ /admin/index.html;
}
