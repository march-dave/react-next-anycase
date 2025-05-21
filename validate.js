const fs = require('fs');
const data = JSON.parse(fs.readFileSync('daily_prompts.json','utf8'));
let errors = [];
if (!Array.isArray(data)) errors.push('Root should be array');
else {
  data.forEach((item, idx) => {
    const reqKeys = ['id','dayOffset','text','tip','theme','timeBucket','taskType'];
    reqKeys.forEach(k => { if(!(k in item)) errors.push(`Item ${idx} missing ${k}`); });
    if(typeof item.id !== 'number') errors.push(`Item ${idx} id not number`);
    if(typeof item.dayOffset !== 'number') errors.push(`Item ${idx} dayOffset not number`);
    if(typeof item.text !== 'string') errors.push(`Item ${idx} text not string`);
    if(typeof item.tip !== 'string') errors.push(`Item ${idx} tip not string`);
    if(typeof item.theme !== 'string') errors.push(`Item ${idx} theme not string`);
    if(!['<5 min','5-10 min'].includes(item.timeBucket)) errors.push(`Item ${idx} bad timeBucket`);
    if(!['Dispose','Organize','Digital'].includes(item.taskType)) errors.push(`Item ${idx} bad taskType`);
  });
}
if(errors.length){
  console.error('Validation errors:\n' + errors.join('\n'));
  process.exit(1);
} else {
  console.log('JSON validation passed');
}
