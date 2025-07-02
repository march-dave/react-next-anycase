function minimizeMaxXOR(nums, k) {
  const n = nums.length;
  const prefix = new Array(n + 1).fill(0);
  for (let i = 0; i < n; i++) {
    prefix[i + 1] = prefix[i] ^ nums[i];
  }
  let max = 0;
  for (const num of nums) {
    max |= num;
  }
  let low = 0, high = max;
  const can = (limit) => {
    const dp = Array.from({ length: k + 1 }, () => new Array(n + 1).fill(false));
    dp[0][0] = true;
    for (let t = 1; t <= k; t++) {
      for (let i = t; i <= n; i++) {
        for (let j = t - 1; j < i; j++) {
          if (dp[t - 1][j] && ((prefix[i] ^ prefix[j]) <= limit)) {
            dp[t][i] = true;
            break;
          }
        }
      }
    }
    return dp[k][n];
  };
  while (low < high) {
    const mid = Math.floor((low + high) / 2);
    if (can(mid)) {
      high = mid;
    } else {
      low = mid + 1;
    }
  }
  return low;
}

module.exports = minimizeMaxXOR;
