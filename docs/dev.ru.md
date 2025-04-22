## для локальной разбаботки

1. скачать репу

```
git clone https://github.com/bad4iz/shallowly
```

2. установить зависимости

```
npm install
```

### что бы слинковать с проектом

3. в Shallowly

```
npm link
```

4. в самом проекте где будет использоватся

```
npm link shallowly
```

5. Когда закончите, удалите линк:

```
npm run unlink
```
