# Plugins
Contains the plugins for `bumpup`.

## Writing your own plugin

To write your own plugin you just need two provide a function with the following shape in your configuration:
```javascript
const plugin = options=>data=>console.log('Hello @bumpup');
```

If you are using typescript `@bumpup/lib` also exports types that you can use
```typescript
export type BumpupData = {
    version?: string,
    type?: string,
    newVersion?: string
}

export type BumpupPluginOptions = Record<string, unknown>;
export type ConfiguredBumpupPlugin = (data: BumpupData) => BumpupData;
export type BumpupPlugin = (options: BumpupPluginOptions) => ConfiguredBumpupPlugin;
```

Then import your plugin in `bumpup.config.mjs` either from node_modules, relative import or completely inline:
```javascript
import plugin1 from '@my/plugin1'
import plugin2 from './plugin2'

const plugin3 = options=>data=>{
    console.log('I\'m a plugin')
    return data;
};

export default {
  version: "2.0.0",
  plugins: [
    plugin1, 
    plugin2, 
    [plugin3, {myoption: true}] //provide an options object to your plugin
  ]
}

```