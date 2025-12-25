// Simple test script to verify localStorage database functionality
// Run with: node test-localstorage.js

// Mock localStorage for Node.js environment
if (typeof localStorage === 'undefined') {
  global.localStorage = {
    _data: {},
    setItem: function(key, value) {
      this._data[key] = value;
    },
    getItem: function(key) {
      return this._data[key] || null;
    },
    removeItem: function(key) {
      delete this._data[key];
    },
    clear: function() {
      this._data = {};
    }
  };
}

// Simple localStorage database implementation (copied from client.ts)
class LocalStorageDB {
  getStorageKey(collection) {
    return `vitality_hub_${collection}`;
  }

  getCollection(collection) {
    const data = localStorage.getItem(this.getStorageKey(collection));
    return data ? JSON.parse(data) : [];
  }

  saveCollection(collection, data) {
    localStorage.setItem(this.getStorageKey(collection), JSON.stringify(data));
  }

  generateId() {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  async find(collection, query = {}) {
    const items = this.getCollection(collection);
    return items.filter(item => {
      for (const [key, value] of Object.entries(query)) {
        if (item[key] !== value) return false;
      }
      return true;
    });
  }

  async insertOne(collection, data) {
    const items = this.getCollection(collection);
    const newItem = { ...data, _id: this.generateId(), createdAt: new Date(), updatedAt: new Date() };
    items.push(newItem);
    this.saveCollection(collection, items);
    return newItem;
  }

  async findOneAndUpdate(collection, query, update) {
    const items = this.getCollection(collection);
    const index = items.findIndex(item => {
      for (const [key, value] of Object.entries(query)) {
        if (item[key] !== value) return false;
      }
      return true;
    });

    if (index === -1) return null;

    items[index] = { ...items[index], ...update, updatedAt: new Date() };
    this.saveCollection(collection, items);
    return items[index];
  }

  async deleteOne(collection, query) {
    const items = this.getCollection(collection);
    const filteredItems = items.filter(item => {
      for (const [key, value] of Object.entries(query)) {
        if (item[key] === value) return false;
      }
      return true;
    });

    if (filteredItems.length === items.length) return false;

    this.saveCollection(collection, filteredItems);
    return true;
  }
}

const localDB = new LocalStorageDB();

async function testCRUD() {
  console.log('🧪 Testing localStorage CRUD operations...\n');

  try {
    // Test CREATE
    console.log('📝 Testing CREATE operation...');
    const newService = await localDB.insertOne('services', {
      title: 'Test Service',
      shortDescription: 'This is a test service',
      fullDescription: 'Full description of test service',
      icon: 'Test',
      duration: '30 minutes',
      idealFor: 'Testing',
      benefits: ['Test benefit 1', 'Test benefit 2'],
      isActive: true,
      sortOrder: 1
    });
    // console.log('✅ Created service:', newService._id);

    // Test READ
    // console.log('\n📖 Testing READ operations...');
    const allServices = await localDB.find('services');
    // console.log('✅ Found services:', allServices.length);

    const activeServices = await localDB.find('services', { isActive: true });
    // console.log('✅ Found active services:', activeServices.length);

    // Test UPDATE
    // console.log('\n✏️ Testing UPDATE operation...');
    const updatedService = await localDB.findOneAndUpdate('services', { _id: newService._id }, {
      title: 'Updated Test Service',
      shortDescription: 'This is an updated test service'
    });
    // console.log('✅ Updated service:', updatedService ? updatedService.title : 'Not found');

    // Test DELETE
    // console.log('\n🗑️ Testing DELETE operation...');
    const deleted = await localDB.deleteOne('services', { _id: newService._id });
    // console.log('✅ Deleted service:', deleted);

    // Verify deletion
    const remainingServices = await localDB.find('services');
    // console.log('✅ Remaining services:', remainingServices.length);

    // console.log('\n🎉 All CRUD operations completed successfully!');

  } catch (error) {
    console.error('Test failed:', error);
  }
}

// Run the test
testCRUD();
