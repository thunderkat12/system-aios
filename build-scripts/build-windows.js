
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔨 Iniciando build para Windows...');

try {
  // 1. Build do projeto React
  console.log('📦 Fazendo build do projeto React...');
  execSync('npm run build', { stdio: 'inherit' });

  // 2. Verificar se o Electron está instalado
  if (!fs.existsSync('node_modules/electron')) {
    console.log('⚡ Instalando Electron...');
    execSync('npm install electron --save-dev', { stdio: 'inherit' });
  }

  // 3. Verificar se o electron-builder está instalado
  if (!fs.existsSync('node_modules/electron-builder')) {
    console.log('🏗️ Instalando Electron Builder...');
    execSync('npm install electron-builder --save-dev', { stdio: 'inherit' });
  }

  // 4. Build do Electron
  console.log('⚡ Fazendo build do Electron...');
  execSync('npx electron-builder --win', { stdio: 'inherit' });

  console.log('✅ Build para Windows concluído com sucesso!');
  console.log('📁 Arquivos gerados na pasta dist/');

} catch (error) {
  console.error('❌ Erro no build:', error.message);
  process.exit(1);
}
