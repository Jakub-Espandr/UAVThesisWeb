# 🚀 UAV Klasifikace - Deployment Guide

## 📋 Předpoklady

- VPS s Ubuntu/Debian
- Nginx nainstalovaný
- Node.js (v16 nebo novější)
- PM2 (nainstaluje se automaticky)
- Certbot pro SSL (Let's Encrypt)

## 📦 Soubory pro nasazení

V adresáři `/Users/jakubespandr/prezenatce` máte připravené:
- `uav-app-deploy.tar.gz` - kompletní aplikace (327 MB)
- `deploy.sh` - automatický deployment script
- `DEPLOYMENT.md` - tento návod

## 🚀 Nasazení na VPS

### 1. **Nahrání souborů na VPS**

```bash
# Z vašeho lokálního počítače
scp uav-app-deploy.tar.gz deploy.sh user@your-vps-ip:/home/user/
```

### 2. **Spuštění deployment scriptu**

```bash
# Připojte se na VPS
ssh user@your-vps-ip

# Přejděte do root adresáře
cd /root

# Zkontrolujte, že soubory jsou tam
ls -la *.tar.gz *.sh

# Přesuňte soubory do /home/user/
mv uav-app-deploy.tar.gz deploy.sh /home/user/

# Přejděte do /home/user/
cd /home/user

# Zkontrolujte soubory
ls -la

# Udělejte script spustitelným
chmod +x deploy.sh

# Spusťte deployment
./deploy.sh
```

### 3. **DNS nastavení**

Přidejte A záznam pro subdoménu:
```
uav.flycamczech-imageprocessor.eu  A  [IP vašeho VPS]
```

### 4. **SSL certifikát**

```bash
# Po úspěšném deploymentu
sudo certbot --nginx -d uav.flycamczech-imageprocessor.eu
```

## 🔧 Konfigurace

### Porty
- **Hlavní aplikace**: port 80/443 (flycamczech-imageprocessor.eu)
- **UAV aplikace**: port 3001 (uav.flycamczech-imageprocessor.eu)

### Adresáře
- **Hlavní aplikace**: `/var/www/imageprocessor/`
- **UAV aplikace**: `/var/www/uav-app/`

## 📊 Monitoring a správa

### PM2 příkazy
```bash
# Status aplikací
pm2 status

# Logy UAV aplikace
pm2 logs uav-app

# Restart UAV aplikace
pm2 restart uav-app

# Restart všech aplikací
pm2 restart all

# Monitorování
pm2 monit
```

### Nginx příkazy
```bash
# Test konfigurace
sudo nginx -t

# Reload konfigurace
sudo systemctl reload nginx

# Restart Nginx
sudo systemctl restart nginx

# Status Nginx
sudo systemctl status nginx
```

## 🔍 Troubleshooting

### Aplikace se nespustí
```bash
# Zkontrolujte logy
pm2 logs uav-app

# Zkontrolujte port
sudo netstat -tlnp | grep 3001

# Restartujte aplikaci
pm2 restart uav-app
```

### Nginx chyby
```bash
# Test konfigurace
sudo nginx -t

# Zkontrolujte logy
sudo tail -f /var/log/nginx/error.log
```

### SSL problémy
```bash
# Obnovte certifikát
sudo certbot renew

# Zkontrolujte certifikát
sudo certbot certificates
```

## 🔄 Aktualizace aplikace

### 1. **Lokální příprava**
```bash
# V adresáři /Users/jakubespandr/prezenatce
tar -czf uav-app-update.tar.gz --exclude=node_modules --exclude=.DS_Store .
```

### 2. **Nahrání na VPS**
```bash
scp uav-app-update.tar.gz user@your-vps-ip:/home/user/
```

### 3. **Aktualizace na VPS**
```bash
# Záloha
sudo cp -r /var/www/uav-app /var/www/uav-app-backup-$(date +%Y%m%d)

# Rozbalení nové verze
cd /var/www/uav-app
sudo tar -xzf /home/user/uav-app-update.tar.gz --strip-components=0

# Instalace závislostí
npm install --production

# Restart aplikace
pm2 restart uav-app
```

## 📈 Optimalizace

### Nginx optimalizace
- Gzip komprese ✅
- Cache headers ✅
- Security headers ✅
- Static file serving ✅

### Aplikace optimalizace
- Lazy loading obrázků ✅
- Image caching ✅
- Memory cleanup ✅
- Hardware acceleration ✅

## 🔒 Bezpečnost

- HTTPS enforcement
- Security headers
- CORS nastavení
- Rate limiting (lze přidat)
- Firewall rules (doporučeno)

## 📞 Support

Pro problémy s nasazením:
1. Zkontrolujte logy: `pm2 logs uav-app`
2. Testujte konfiguraci: `sudo nginx -t`
3. Zkontrolujte porty: `sudo netstat -tlnp | grep 3001`

---

**Úspěšné nasazení!** 🎉
Vaše UAV klasifikační aplikace bude dostupná na: `https://uav.flycamczech-imageprocessor.eu`
