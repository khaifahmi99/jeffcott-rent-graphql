import { graph, config, connector } from '@grafbase/sdk'

const g = graph.Standalone()

const mongo = connector.MongoDB('MongoDB', {
  url: g.env('MONGODB_API_URL'),
  apiKey: g.env('MONGODB_API_KEY'),
  dataSource: g.env('MONGODB_DATASOURCE'),
  database: g.env('MONGODB_DATABASE'),
})

mongo.model('Resident', {
  firstName: g.string(),
  lastName: g.string(),
  email: g.email().unique(),
  phone: g.string().optional(),
  dob: g.datetime().optional(), 
}).collection('Resident');

const billTypeEnum = g.enum('BillType', ['Electricity', 'Gas', 'Water', 'Wifi', 'Grocery', 'Others'])

mongo.model('Bill', {
  title: g.string(),
  type: g.enumRef(billTypeEnum),
  amount: g.float(),
  date: g.datetime(),
  paid: g.boolean(),
  paidDate: g.datetime().optional(),
  description: g.string().optional(),
  residents: g.ref('Resident').list(),
}).collection('Bill');

g.datasource(mongo, {namespace: false})

export default config({ schema: g })