import { AppDataSource } from '../data-source';
import { Tenant } from '../../src/tenants/tenants.model';
import { Practice } from '../../src/practices/practices.model';
import { ResourceStatus } from '../../src/common/enums';

const HOSPITAL_DATA = [
  {
    "name": "Mediclinic Southern Africa",
    "telephone": "+27 21 464 5500",
    "website": "https://www.mediclinic.co.za",
    "email": "hospmngrcapet@mediclinic.co.za",
    "address": "21 Hof Street, Oranjezicht, Cape Town, 8001",
    "geoLocation": {
      "latitude": -33.9334,
      "longitude": 18.4098
    },
    "logoUrl": "https://www.mediclinic.co.za/etc.clientlibs/mc-corporate/clientlibs/clientlib-site/resources/images/logo.svg",
    "practices": [
      {
        "name": "Mediclinic Cape Town",
        "address": "21 Hof Street, Oranjezicht, Cape Town, 8001",
        "geoLocation": {
          "latitude": -33.9334,
          "longitude": 18.4098
        }
      },
      {
        "name": "Mediclinic Constantiaberg",
        "address": "Burnham Road, Plumstead, Cape Town, 7800",
        "geoLocation": {
          "latitude": -34.0267,
          "longitude": 18.4628
        }
      },
      {
        "name": "Mediclinic Panorama",
        "address": "Rothschild Boulevard, Panorama, Cape Town, 7500",
        "geoLocation": {
          "latitude": -33.8810,
          "longitude": 18.5780
        }
      },
      {
        "name": "Mediclinic Milnerton",
        "address": "Cnr Racecourse & Koeberg Road, Milnerton, Cape Town, 7441",
        "geoLocation": {
          "latitude": -33.8680,
          "longitude": 18.5020
        }
      },
      {
        "name": "Mediclinic Louis Leipoldt",
        "address": "Broadway, Bellville, Cape Town, 7530",
        "geoLocation": {
          "latitude": -33.9020,
          "longitude": 18.6290
        }
      },
      {
        "name": "Mediclinic Durbanville",
        "address": "45 Wellington Road, Durbanville, Cape Town, 7550",
        "geoLocation": {
          "latitude": -33.8320,
          "longitude": 18.6470
        }
      },
      {
        "name": "Mediclinic Cape Gate",
        "address": "Cnr Okavango and Tanner Roads, Brackenfell, Cape Town, 7560",
        "geoLocation": {
          "latitude": -33.8430,
          "longitude": 18.6940
        }
      }
    ]
  },
  {
    "name": "Netcare",
    "telephone": "+27 21 441 0000",
    "website": "https://www.netcare.co.za",
    "email": "CBMHPreAdmissions@netcare.co.za",
    "address": "Cnr DF Malan Street and Rua Bartholomeu Dias Plain, Foreshore, Cape Town, 8001",
    "geoLocation": {
      "latitude": -33.9189,
      "longitude": 18.4287
    },
    "logoUrl": "https://www.netcare.co.za/Images/Netcare-Logo.png",
    "practices": [
      {
        "name": "Netcare Christiaan Barnard Memorial Hospital",
        "address": "Cnr DF Malan Street and Rua Bartholomeu Dias Plain, Foreshore, Cape Town, 8001",
        "geoLocation": {
          "latitude": -33.9189,
          "longitude": 18.4287
        }
      },
      {
        "name": "Netcare Blaauwberg Hospital",
        "address": "Waterville Crescent, Sunningdale, Cape Town, 7441",
        "geoLocation": {
          "latitude": -33.8040,
          "longitude": 18.4810
        }
      },
      {
        "name": "Netcare Kuils River Hospital",
        "address": "33 Van Riebeeck Road, Kuils River, Cape Town, 7580",
        "geoLocation": {
          "latitude": -33.9210,
          "longitude": 18.6810
        }
      },
      {
        "name": "Netcare N1 City Hospital",
        "address": "Louwtjie Rothman Street, Goodwood, Cape Town, 7460",
        "geoLocation": {
          "latitude": -33.8940,
          "longitude": 18.5520
        }
      },
      {
        "name": "Netcare UCT Private Academic Hospital",
        "address": "D18 Anzio Rd, Observatory, Cape Town, 7925",
        "geoLocation": {
          "latitude": -33.9410,
          "longitude": 18.4630
        }
      }
    ]
  },
  {
    "name": "Life Healthcare",
    "telephone": "+27 21 670 4000",
    "website": "https://www.lifehealthcare.co.za",
    "email": "carmen.loots@lifehealthcare.co.za",
    "address": "Wilderness Road, Claremont, Cape Town, 7708",
    "geoLocation": {
      "latitude": -33.9802,
      "longitude": 18.4672
    },
    "logoUrl": "https://www.lifehealthcare.co.za/Images/logo.svg",
    "practices": [
      {
        "name": "Life Kingsbury Hospital",
        "address": "Wilderness Road, Claremont, Cape Town, 7708",
        "geoLocation": {
          "latitude": -33.9802,
          "longitude": 18.4672
        }
      },
      {
        "name": "Life Vincent Pallotti Hospital",
        "address": "Alexandra Road, Pinelands, Cape Town, 7405",
        "geoLocation": {
          "latitude": -33.9405,
          "longitude": 18.4900
        }
      },
      {
        "name": "Life Peninsula Eye Hospital",
        "address": "Wilderness Rd, Claremont, Cape Town, 7708",
        "geoLocation": {
          "latitude": -33.9802,
          "longitude": 18.4672
        }
      },
      {
        "name": "Life Sports Science Orthopaedic Surgical Day Centre",
        "address": "Boundary Rd, Newlands, Cape Town, 7700",
        "geoLocation": {
          "latitude": -33.9723,
          "longitude": 18.4688
        }
      }
    ]
  },
  {
    "name": "Western Cape Government Health (Public Sector)",
    "telephone": "+27 21 483 3245",
    "website": "https://www.westerncape.gov.za/health-wellness/",
    "email": "Marika.Champion@westerncape.gov.za",
    "address": "4 Dorp Street, Cape Town City Centre, Cape Town, 8001",
    "geoLocation": {
      "latitude": -33.9249,
      "longitude": 18.4168
    },
    "logoUrl": "https://www.westerncape.gov.za/sites/all/themes/wcg_main/logo.png",
    "practices": [
      {
        "name": "Groote Schuur Hospital",
        "address": "Main Rd, Observatory, Cape Town, 7925",
        "geoLocation": {
          "latitude": -33.9414,
          "longitude": 18.4637
        }
      },
      {
        "name": "Tygerberg Hospital",
        "address": "Francie Van Zijl Dr, Tygerberg, Cape Town, 7505",
        "geoLocation": {
          "latitude": -33.9038,
          "longitude": 18.6146
        }
      },
      {
        "name": "Red Cross War Memorial Children's Hospital",
        "address": "Klipfontein Rd, Rondebosch, Cape Town, 7700",
        "geoLocation": {
          "latitude": -33.9536,
          "longitude": 18.4883
        }
      },
      {
        "name": "New Somerset Hospital",
        "address": "Portswood Rd, Green Point, Cape Town, 8005",
        "geoLocation": {
          "latitude": -33.9040,
          "longitude": 18.4140
        }
      },
      {
        "name": "Victoria Hospital Wynberg",
        "address": "Alphen Hill Rd, Wynberg, Cape Town, 7800",
        "geoLocation": {
          "latitude": -34.0084,
          "longitude": 18.4619
        }
      },
      {
        "name": "Mitchells Plain Hospital",
        "address": "8 A Z Berman Dr, Lentegeur, Cape Town, 7785",
        "geoLocation": {
          "latitude": -34.0470,
          "longitude": 18.6010
        }
      },
      {
        "name": "False Bay Hospital",
        "address": "17th Ave, Fish Hoek, Cape Town, 7975",
        "geoLocation": {
          "latitude": -34.1352,
          "longitude": 18.4285
        }
      },
      {
        "name": "Karl Bremer Hospital",
        "address": "Frans Conradie Dr, Bellville, Cape Town, 7530",
        "geoLocation": {
          "latitude": -33.8960,
          "longitude": 18.6150
        }
      }
    ]
  },
  {
    "name": "Melomed Hospital Group",
    "telephone": "+27 21 699 0950",
    "website": "https://www.melomed.co.za",
    "email": "info@melomed.co.za",
    "address": "148 Imam Haron Street, Gatesville, Cape Town, 7735",
    "geoLocation": {
      "latitude": -33.9749,
      "longitude": 18.5303
    },
    "logoUrl": "https://www.melomed.co.za/images/logo.png",
    "practices": [
      {
        "name": "Melomed Gatesville",
        "address": "148 Imam Haron Road, Gatesville, Cape Town, 7735",
        "geoLocation": {
          "latitude": -33.9749,
          "longitude": 18.5303
        }
      },
      {
        "name": "Melomed Bellville",
        "address": "Cnr Voortrekker and AJ West Street, Bellville, Cape Town, 7530",
        "geoLocation": {
          "latitude": -33.9015,
          "longitude": 18.6318
        }
      },
      {
        "name": "Melomed Tokai",
        "address": "Cnr Keysers & Main Road, Tokai, Cape Town, 7945",
        "geoLocation": {
          "latitude": -34.0736,
          "longitude": 18.4556
        }
      },
      {
        "name": "Melomed Mitchells Plain",
        "address": "Symphony Walk, Town Centre, Mitchells Plain, Cape Town, 7785",
        "geoLocation": {
          "latitude": -34.0487,
          "longitude": 18.6186
        }
      }
    ]
  },
  {
    "name": "Busamed",
    "telephone": "+27 21 840 6600",
    "website": "https://www.busamed.co.za",
    "email": "info.paardevlei@busamed.co.za",
    "address": "4 Gardner Williams Avenue, Paardevlei Estate, Somerset West, Cape Town, 7130",
    "geoLocation": {
      "latitude": -34.0847,
      "longitude": 18.8159
    },
    "logoUrl": "https://www.busamed.co.za/wp-content/uploads/2020/09/Busamed-Logo-Web.png",
    "practices": [
      {
        "name": "Busamed Paardevlei Private Hospital",
        "address": "4 Gardner Williams Avenue, Paardevlei Estate, Somerset West, Cape Town, 7130",
        "geoLocation": {
          "latitude": -34.0847,
          "longitude": 18.8159
        }
      }
    ]
  },
  {
    "name": "The Salvation Army",
    "telephone": "+27 21 465 4846",
    "website": "https://boothhosp.org",
    "email": "info@boothhosp.org",
    "address": "32 Prince Street, Oranjezicht, Cape Town, 8001",
    "geoLocation": {
      "latitude": -33.9405,
      "longitude": 18.4116
    },
    "logoUrl": "https://www.salvationarmy.org.za/wp-content/themes/salvation-army/images/logo.png",
    "practices": [
      {
        "name": "Booth Memorial Hospital",
        "address": "32 Prince Street, Oranjezicht, Cape Town, 8001",
        "geoLocation": {
          "latitude": -33.9405,
          "longitude": 18.4116
        }
      }
    ]
  }
];

function parseAddress(fullAddress: string) {
  const parts = fullAddress.split(',').map(p => p.trim());
  return {
    address: parts[0],
    city: parts[parts.length - 2] || 'Cape Town',
    state: 'Western Cape',
    zip: parts[parts.length - 1] || '8001'
  };
}

async function seed(): Promise<void> {
  await AppDataSource.initialize();
  console.log('🌱 Starting hierarchical seed for hospitals...');

  const tenantRepo = AppDataSource.getRepository(Tenant);
  const practiceRepo = AppDataSource.getRepository(Practice);

  for (const tenantData of HOSPITAL_DATA) {
    let tenant = await tenantRepo.findOne({ where: { name: tenantData.name } });
    if (!tenant) {
      tenant = tenantRepo.create({
        name: tenantData.name,
        email: tenantData.email,
        phone: tenantData.telephone,
        website: tenantData.website,
        imageUrl: tenantData.logoUrl,
        status: ResourceStatus.ACTIVE,
      });
      tenant = await tenantRepo.save(tenant);
      console.log(`✅ Seeded Tenant: ${tenant.name}`);
    } else {
      console.log(`ℹ️ Tenant already exists: ${tenant.name}`);
    }

    // Seed Practices for this Tenant
    for (const practiceData of tenantData.practices) {
      let practice = await practiceRepo.findOne({ 
        where: { name: practiceData.name, tenant: { id: tenant.id } } 
      });

      const addr = parseAddress(practiceData.address);

      if (!practice) {
        practice = practiceRepo.create({
          tenant,
          name: practiceData.name,
          address: addr.address,
          city: addr.city,
          state: addr.state,
          zip: addr.zip,
          phone: tenantData.telephone, // Default to tenant phone
          email: tenantData.email, // Default to tenant email
          website: tenantData.website,
          latitude: practiceData.geoLocation.latitude,
          longitude: practiceData.geoLocation.longitude,
          status: ResourceStatus.ACTIVE,
        });
        await practiceRepo.save(practice);
        console.log(`  📍 Seeded Practice: ${practice.name}`);
      } else {
        console.log(`  ℹ️ Practice already exists: ${practice.name}`);
      }
    }
  }

  console.log('🏁 Hierarchical seed completed successfully.');
  await AppDataSource.destroy();
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
