class ApiFeatures {
  constructor(mongooseQuery, queryData) {
    this.mongooseQuery = mongooseQuery;
    this.queryData = queryData;
  }

  pignate() {
    let { page, size } = this.queryData;
    if (!page || page <= 0) {
      page = 1;
    }
    if (!size || size <= 0) {
      size = 2;
    }
    const skip = (parseInt(page) - 1) * parseInt(size); //pagination equation...
    this.mongooseQuery.limit(parseInt(size)).skip(skip);
    return this;
  }

  filter() {
    const removedKeys = ["page", "size", "sort", "search", "fields"];
    let query = { ...this.queryData };
    removedKeys.forEach((key) => {
      delete query[key];
    });

    let modifiedQuery = JSON.parse(
      JSON.stringify(query).replace(
        /(gt|gte|eq|neq|lt|lte|in|nin)/g,
        (match) => `$${match}`
      )
    );
    this.mongooseQuery.find(modifiedQuery);
    return this;
  }

  sort() {
    if (this.queryData.sort) {
      this.mongooseQuery.sort(this.queryData.sort.replaceAll(",", " "));
    }
    return this;
  }

  search() {
    if (this.queryData.search) {
      this.mongooseQuery.find({
        $or: [
          { name: { $regex: `${this.queryData.search}`, $options: "i" } },
          {
            description: { $regex: `${this.queryData.search}`, $options: "i" },
          },
        ],
      });
    }
    return this;
  }

  select() {
    if (this.queryData.fields) {
      this.mongooseQuery.select(this.queryData.fields.replaceAll(",", " "));
    }
    return this;
  }
}
export default ApiFeatures;
