// Script to identify host-related fields in App Properties that should be moved to App Hosts
// This script analyzes the Webflow collections and identifies the migration needed

const hostRelatedFields = [
  // Host status fields
  {
    fieldId: '4bba09991e9d04fd7c3a472a7dd7c5c5',
    slug: 'super-host',
    displayName: 'Super Host',
    type: 'Switch',
    shouldMove: true,
    targetField: 'super_host'
  },
  {
    fieldId: '75a2320a8b0e67bd0dcaaead9c61d107',
    slug: 'plus-host',
    displayName: 'Plus Host',
    type: 'Switch',
    shouldMove: true,
    targetField: 'plus_host'
  },
  {
    fieldId: '363a687ec6df41b03c62607cb0559bef',
    slug: 'premium-host',
    displayName: 'Premium Host',
    type: 'Switch',
    shouldMove: true,
    targetField: 'premium_host'
  },
  {
    fieldId: '4d9137959f722e00e35c1e989a131169',
    slug: 'verified-host',
    displayName: 'Verified Host',
    type: 'Switch',
    shouldMove: true,
    targetField: 'verified_host'
  },
  
  // Host management fields
  {
    fieldId: '347b72debb9f470a2a371468e8340ada',
    slug: 'agent-managing-this-location',
    displayName: 'Agent managing this location',
    type: 'Reference',
    shouldMove: false, // This is the reference field, should stay
    targetField: null
  },
  
  // Host accolade fields
  {
    fieldId: 'a5531c0f12de4e7d2924274bed44cb69',
    slug: 'accolade-icon',
    displayName: 'Accolade Icon',
    type: 'Image',
    shouldMove: true,
    targetField: 'accolade_icon_url'
  },
  {
    fieldId: '6bbad9caa2bdc6a052bfa737400a5e17',
    slug: 'host-accolades-switch-2',
    displayName: 'Host Accolades Switch',
    type: 'Switch',
    shouldMove: true,
    targetField: 'host_accolades_switch'
  },
  {
    fieldId: '315e247dca977bd81fd4b8948554ca12',
    slug: 'host-accolade-image-switch',
    displayName: 'Host Accolade Image Switch',
    type: 'Switch',
    shouldMove: true,
    targetField: 'host_accolade_image_switch'
  },
  
  // Account fields
  {
    fieldId: '51558c81b37684469f50571dd07b033d',
    slug: 'account-owner',
    displayName: 'Account Owner',
    type: 'PlainText',
    shouldMove: true,
    targetField: 'account_owner'
  },
  {
    fieldId: 'fcb7a2adbc9b6f6f9af20cdcefd2cf06',
    slug: 'whalesync-postgres-id',
    displayName: 'whalesync_postgres_id',
    type: 'PlainText',
    shouldMove: true,
    targetField: 'whalesync_postgres_id'
  }
];

// Fields that should be added to App Hosts collection
const newAppHostFields = [
  {
    name: 'first-name',
    displayName: 'First name',
    type: 'PlainText',
    required: false
  },
  {
    name: 'last-name', 
    displayName: 'Last name',
    type: 'PlainText',
    required: false
  },
  {
    name: 'card-image',
    displayName: 'Card image',
    type: 'Image',
    required: false
  },
  {
    name: 'hero-image',
    displayName: 'Hero image', 
    type: 'Image',
    required: false
  },
  {
    name: 'agent-location',
    displayName: 'Agent location',
    type: 'PlainText',
    required: false
  },
  {
    name: 'short-bio',
    displayName: 'Short bio',
    type: 'PlainText',
    required: false
  },
  {
    name: 'vacation-image-first',
    displayName: 'Vacation image | First',
    type: 'Image',
    required: false
  },
  {
    name: 'vacation-image-second',
    displayName: 'Vacation image | Second',
    type: 'Image',
    required: false
  },
  {
    name: 'email',
    displayName: 'Email',
    type: 'Email',
    required: false
  },
  {
    name: 'phone',
    displayName: 'Phone',
    type: 'Phone',
    required: false
  },
  {
    name: 'instagram-link',
    displayName: 'Instagram link',
    type: 'Link',
    required: false
  },
  {
    name: 'facebook-link',
    displayName: 'Facebook link',
    type: 'Link',
    required: false
  },
  {
    name: 'linkedin-link',
    displayName: 'Linkedin link',
    type: 'Link',
    required: false
  },
  {
    name: 'youtube-link',
    displayName: 'YouTube link',
    type: 'Link',
    required: false
  }
];

// Migration summary
const migrationSummary = {
  fieldsToMove: hostRelatedFields.filter(field => field.shouldMove),
  fieldsToKeep: hostRelatedFields.filter(field => !field.shouldMove),
  newFieldsToAdd: newAppHostFields,
  totalFieldsToMove: hostRelatedFields.filter(field => field.shouldMove).length,
  totalNewFields: newAppHostFields.length
};

console.log('=== HOST MIGRATION ANALYSIS ===');
console.log(`Fields to move from App Properties to App Hosts: ${migrationSummary.totalFieldsToMove}`);
console.log(`New fields to add to App Hosts: ${migrationSummary.totalNewFields}`);
console.log(`Fields to keep in App Properties: ${migrationSummary.fieldsToKeep.length}`);

console.log('\n=== FIELDS TO MOVE ===');
migrationSummary.fieldsToMove.forEach(field => {
  console.log(`- ${field.displayName} (${field.slug}) → ${field.targetField}`);
});

console.log('\n=== FIELDS TO KEEP IN APP PROPERTIES ===');
migrationSummary.fieldsToKeep.forEach(field => {
  console.log(`- ${field.displayName} (${field.slug}) - Reference field`);
});

console.log('\n=== NEW FIELDS TO ADD TO APP HOSTS ===');
migrationSummary.newFieldsToAdd.forEach(field => {
  console.log(`- ${field.displayName} (${field.name}) - ${field.type}`);
});

export { hostRelatedFields, newAppHostFields, migrationSummary };

