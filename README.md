# import-analyzer

Поиск импортов модуля в файлах проекта

## Сборка
```bash
npm run build
```

## Запуск
### Стандартный режим
```bash
node build/import-analyzer.js <...входные точки> <название модуля>
```

**Пример:**
```bash
node build/import-analyzer.js common candidate styled-components
```

### Режим проверки staged-файлов
```bash
node build/import-analyzer.js --staged-check <название модуля>
```

**Пример:**
```bash
node build/import-analyzer.js --staged-check  styled-components
```
