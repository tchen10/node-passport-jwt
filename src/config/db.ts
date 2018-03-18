import { config } from './index';

const Cloudant = require('@cloudant/cloudant');
const cloudant = Cloudant({account: config.DB.ACCOUNT, password: config.DB.PASSWORD});

export { cloudant };