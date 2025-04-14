import axios from 'axios';
import { logger } from '../utils/logger';

class IntegrationService {
  constructor() {
    this.paymentGateways = {
      stripe: this.configureStripe(),
      paypal: this.configurePayPal(),
      // Add more payment gateways as needed
    };

    this.pmsSystems = {
      opera: this.configureOperaPMS(),
      // Add more PMS systems as needed
    };

    this.crmSystems = {
      salesforce: this.configureSalesforce(),
      // Add more CRM systems as needed
    };

    this.messagingProviders = {
      twilio: this.configureTwilio(),
      // Add more messaging providers as needed
    };
  }

  // Payment Gateway Integration
  configureStripe() {
    return {
      processPayment: async (paymentData) => {
        try {
          const response = await axios.post(
            'https://api.stripe.com/v1/payments',
            paymentData,
            {
              headers: {
                'Authorization': `Bearer ${process.env.STRIPE_SECRET_KEY}`,
                'Content-Type': 'application/json'
              }
            }
          );
          await logger.logTransaction({
            type: 'payment',
            gateway: 'stripe',
            status: 'success',
            data: response.data
          });
          return response.data;
        } catch (error) {
          await logger.logError(error, { context: 'stripe_payment' });
          throw error;
        }
      }
    };
  }

  configurePayPal() {
    return {
      processPayment: async (paymentData) => {
        try {
          const response = await axios.post(
            'https://api.paypal.com/v2/payments',
            paymentData,
            {
              headers: {
                'Authorization': `Bearer ${process.env.PAYPAL_ACCESS_TOKEN}`,
                'Content-Type': 'application/json'
              }
            }
          );
          await logger.logTransaction({
            type: 'payment',
            gateway: 'paypal',
            status: 'success',
            data: response.data
          });
          return response.data;
        } catch (error) {
          await logger.logError(error, { context: 'paypal_payment' });
          throw error;
        }
      }
    };
  }

  // PMS Integration
  configureOperaPMS() {
    return {
      syncInventory: async (inventoryData) => {
        try {
          const response = await axios.post(
            `${process.env.OPERA_PMS_API_URL}/inventory`,
            inventoryData,
            {
              headers: {
                'Authorization': `Bearer ${process.env.OPERA_PMS_TOKEN}`,
                'Content-Type': 'application/json'
              }
            }
          );
          await logger.logSystemEvent({
            type: 'pms_sync',
            system: 'opera',
            status: 'success',
            data: response.data
          });
          return response.data;
        } catch (error) {
          await logger.logError(error, { context: 'opera_pms_sync' });
          throw error;
        }
      }
    };
  }

  // CRM Integration
  configureSalesforce() {
    return {
      syncCustomerData: async (customerData) => {
        try {
          const response = await axios.post(
            `${process.env.SALESFORCE_API_URL}/customers`,
            customerData,
            {
              headers: {
                'Authorization': `Bearer ${process.env.SALESFORCE_ACCESS_TOKEN}`,
                'Content-Type': 'application/json'
              }
            }
          );
          await logger.logUserActivity({
            type: 'crm_sync',
            system: 'salesforce',
            status: 'success',
            data: response.data
          });
          return response.data;
        } catch (error) {
          await logger.logError(error, { context: 'salesforce_sync' });
          throw error;
        }
      }
    };
  }

  // Messaging Integration
  configureTwilio() {
    return {
      sendSMS: async (messageData) => {
        try {
          const response = await axios.post(
            'https://api.twilio.com/2010-04-01/Accounts/ACCOUNT_SID/Messages.json',
            messageData,
            {
              headers: {
                'Authorization': `Basic ${Buffer.from(
                  `${process.env.TWILIO_ACCOUNT_SID}:${process.env.TWILIO_AUTH_TOKEN}`
                ).toString('base64')}`,
                'Content-Type': 'application/x-www-form-urlencoded'
              }
            }
          );
          await logger.logSystemEvent({
            type: 'sms',
            provider: 'twilio',
            status: 'success',
            data: response.data
          });
          return response.data;
        } catch (error) {
          await logger.logError(error, { context: 'twilio_sms' });
          throw error;
        }
      }
    };
  }

  // API Endpoints for External Integration
  async handleExternalRequest(req, res) {
    try {
      const { system, action, data } = req.body;
      
      switch (system) {
        case 'payment':
          const gateway = this.paymentGateways[data.gateway];
          if (!gateway) {
            throw new Error('Unsupported payment gateway');
          }
          const paymentResult = await gateway.processPayment(data);
          return res.json(paymentResult);

        case 'pms':
          const pms = this.pmsSystems[data.system];
          if (!pms) {
            throw new Error('Unsupported PMS system');
          }
          const pmsResult = await pms.syncInventory(data);
          return res.json(pmsResult);

        case 'crm':
          const crm = this.crmSystems[data.system];
          if (!crm) {
            throw new Error('Unsupported CRM system');
          }
          const crmResult = await crm.syncCustomerData(data);
          return res.json(crmResult);

        case 'messaging':
          const provider = this.messagingProviders[data.provider];
          if (!provider) {
            throw new Error('Unsupported messaging provider');
          }
          const messageResult = await provider.sendSMS(data);
          return res.json(messageResult);

        default:
          throw new Error('Unsupported integration system');
      }
    } catch (error) {
      await logger.logError(error, { context: 'external_integration' });
      return res.status(500).json({
        error: {
          code: 'INTEGRATION_ERROR',
          message: error.message,
          details: error.stack
        }
      });
    }
  }

  // Data Format Conversion
  convertToXML(jsonData) {
    const convert = (obj) => {
      let xml = '';
      for (const key in obj) {
        if (Array.isArray(obj[key])) {
          xml += `<${key}>`;
          obj[key].forEach(item => {
            xml += convert(item);
          });
          xml += `</${key}>`;
        } else if (typeof obj[key] === 'object') {
          xml += `<${key}>${convert(obj[key])}</${key}>`;
        } else {
          xml += `<${key}>${obj[key]}</${key}>`;
        }
      }
      return xml;
    };
    return `<?xml version="1.0" encoding="UTF-8"?><root>${convert(jsonData)}</root>`;
  }

  convertToJSON(xmlData) {
    // Implementation for XML to JSON conversion
    // This is a placeholder - you would need to implement or use a library
    // like xml2js or fast-xml-parser
    throw new Error('XML to JSON conversion not implemented');
  }
}

export const integrationService = new IntegrationService(); 