class ApiFeatures {
    constructor(mongooseQuery, data) {
        this.mongooseQuery = mongooseQuery;
        this.data = data;
    }

    pagination() {
        let { page, limit } = this.data;
        limit = limit && limit > 0 ? Number(limit) : 5; // Default limit
        page = page && page > 0 ? Number(page) : 1; // Default page
        const skip = (page - 1) * limit;
        this.mongooseQuery.limit(limit).skip(skip);
        return this;
    }

    sort() {
        if (this.data.sort) {
            const sortBy = this.data.sort.replaceAll(',', ' ');
            this.mongooseQuery.sort(sortBy);
        }
        return this;
    }

    fields() {
        if (this.data.fields) {
            const fields = this.data.fields.replaceAll(',', ' ');
            this.mongooseQuery.select(fields);
        }
        return this;
    }

    search() {
        if (this.data.search) {
            const searchQuery = {
                $or: [
                    { title: { $regex: this.data.search, $options: 'i' } },
                    { name: { $regex: this.data.search, $options: 'i' } },
                    { description: { $regex: this.data.search, $options: 'i' } }
                ]
            };
            this.mongooseQuery.find(searchQuery);
        }
        return this;
    }
}

export default ApiFeatures;