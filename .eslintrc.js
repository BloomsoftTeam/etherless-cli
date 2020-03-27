module.exports = {
   "parser": "@typescript-eslint/parser",
   "plugins": ["@typescript-eslint"],
   "extends": ["airbnb"],
   "parserOptions": {
     project: './tsconfig.json',
   },
   "settings": {
        'import/extensions': [".js",".jsx",".ts",".tsx"],
        'import/parsers': {
          '@typescript-eslint/parser': [".ts",".tsx"]
         },
         'import/resolver': {
             'node': {
                 'extensions': [".js",".jsx",".ts",".tsx"]
             }
         }
    }
}
