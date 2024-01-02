const t = require('@babel/types');

const identifierMappings = {
  էջ: '$',
  ոճ: 'css',
  հատկանիշ: 'attr',
  կցել: 'append',
  սկզբիցԿցել: 'prepend',
  տեքստ: 'text',
  երբ: 'on',
  կանխելԻրադարձությունը: 'preventDefault',
  արժեք: 'val',
  ջնջել: 'remove',
  թիրախ: 'target'
};

const identifierTransformers = Object.entries(identifierMappings).reduce(
  (result, [key, value]) => {
    result[key] = () => t.identifier(value);
    return result;
  },
  {},
);

module.exports = {
  identifierTransformers,
};
