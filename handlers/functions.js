async function consoleLogPromise(callback) {
  const res = await callback;
  console.log(res);
}

async function PromiseAChangeCount() {
  let count = 0;
  return new Promise((resolve, _) => {
    setTimeout(() => {
      count = 2;
      resolve(count)
    }, 200);
  })
}

module.exports = { consoleLogPromise }