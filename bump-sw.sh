#!/bin/bash
# Bump Service Worker version — ejecutar tras cualquier cambio en archivos HTML/JS
# Uso: bash bump-sw.sh

SW="$(dirname "$0")/sw.js"
DATE=$(date +%Y%m%d)

# Lee versión actual
CURRENT=$(grep -oP "ventas-\K[^\']+" "$SW" | head -1)

# Si ya tiene la fecha de hoy, incrementa el contador
if [[ "$CURRENT" == ${DATE}* ]]; then
  N=$(echo "$CURRENT" | grep -oP '\d+$')
  N=$((N + 1))
  NEW="${DATE}-${N}"
else
  NEW="${DATE}-1"
fi

# Aplica el cambio
sed -i "s/ventas-${CURRENT}/ventas-${NEW}/g" "$SW"
sed -i "s/Service Worker — .*/Service Worker — v${NEW}/" "$SW"

echo "✓ SW actualizado: ventas-${CURRENT} → ventas-${NEW}"
