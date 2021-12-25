import GUN from 'gun';

let gun = new GUN();

gun.get('mark').put({
    name: "Mark",
    email: "mark@gun.eco",
});

gun.get('mark').on(async (data, key) => {
    console.log("realtime updates:", data);
    console.log({ key })
    let account = await gun.get('mark').get('account');
    console.log({ account })
});

setInterval(() => { gun.get('mark').get('account').put({ details: Math.random() }) }, Math.random() * 1000);