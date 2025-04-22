## For Local Development

1. Clone the repository:

```
git clone https://github.com/bad4iz/shallowly
```

2. Install dependencies:

```
npm install
```

### To link with your project:

3. In the Shallowly directory:

```
npm link
```

4. In your project where it will be used:

```
npm link shallowly
```

5. When finished, unlink:

```
npm run unlink
```

### Additional Notes:

- Step 3 makes Shallowly available globally for linking
- Step 4 connects your project to the local Shallowly version
- Step 5 reverts to the npm registry version when done testing

> This workflow lets you test changes to Shallowly in your actual project before publishing.
