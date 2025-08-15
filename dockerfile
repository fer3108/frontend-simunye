# Usa la imagen oficial de Node
FROM node:22-alpine

# Establece el directorio de trabajo
WORKDIR /app

# Copia los archivos de configuración
COPY package.json yarn.lock* package-lock.json* ./

# Instala dependencias
RUN npm install

# Copia el resto de los archivos
COPY . .

# Construye la aplicación
RUN npm run build

# Puerto de exposición
EXPOSE 4173

# Comando para ejecutar la aplicación
CMD ["npm", "run", "preview"] 
# O usa esto para Create React App:
# CMD ["npm", "start"]