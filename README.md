# minecraft-item-api  
  
For personal use, but feel free to use it & fork! Please consider caching images to save me bandwidth.  
  
Warning:  
Images are not 100% correct, and is supposed to be used where images cannot be closely looked at to spot those issues.  
Some apparent issues are low resolution on blocks and blocks that have different textures on their sides having the same texture on all sides (E.G: `SANDSTONE_SMOOTH`).  
  
Usage:  
`https://mcapi.marveldc.me/item/itemName?version=#.##&width=###&height=###&fuzzySearch=bool`  
  
Available itemName:  
See wanted version's `rendered.json` for `{ ...name: 'ITEM_NAME' }`. Item names in the request are automatically standardised, so they can be lower case and contain spaces.  
If an unknown item name is provided, the item name is fuzzy searched through the version, and if not found, exact search is done on 1.17 json, if not already 1.17, and finally, it'll result to 1.17's `STONE`.  
  
Available versions:  
- `1.8`  
- `1.12`  
- `1.16`  
- `1.17`  
  
Size:  
`width` and `height` are optional, defaults to `16x16`.  
  
Fuzzy search:  
`fuzzySearch` is also optional, defaults to `true`. Set to `false` to avoid fuzzy searching.  
  
Examples:
- https://mcapi.marveldc.me/item/dirt?version=1.17&width=200&height=200
- https://mcapi.marveldc.me/item/glass?version=1.17
- https://mcapi.marveldc.me/item/glass?version=1.12
- https://mcapi.marveldc.me/item/sandstone?version=1.12&fuzzySearch=0

Textures were made from (minecraft-blocks-render)[https://www.npmjs.com/package/minecraft-blocks-render].