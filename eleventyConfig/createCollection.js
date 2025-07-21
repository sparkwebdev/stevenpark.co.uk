const createCollection = (eleventyConfig, name, globPattern, options = {}) => {
  const { limit, filter } = options;
  
  eleventyConfig.addCollection(name, collection => {
    let items = [...collection.getFilteredByGlob(globPattern)].reverse();
    
    if (filter) {
      items = items.filter(filter);
    }
    
    if (limit) {
      items = items.slice(0, limit);
    }
    
    return items;
  });
};

export default createCollection; 