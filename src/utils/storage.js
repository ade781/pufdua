
const KEY_RSVP = "rsvp_list_v1";
const KEY_WISHES = "wishes_v1";

export const storage = {
  getRSVP() {
    try { return JSON.parse(localStorage.getItem(KEY_RSVP)) ?? []; } catch { return []; }
  },
  addRSVP(item) {
    const cur = storage.getRSVP();
    cur.push(item);
    localStorage.setItem(KEY_RSVP, JSON.stringify(cur));
    return cur;
  },
  getWishes() {
    try { return JSON.parse(localStorage.getItem(KEY_WISHES)) ?? []; } catch { return []; }
  },
  addWish(item) {
    const cur = storage.getWishes();
    cur.unshift(item);
    localStorage.setItem(KEY_WISHES, JSON.stringify(cur));
    return cur;
  },
  likeWish(index) {
    const cur = storage.getWishes();
    if (cur[index]) cur[index].likes = (cur[index].likes || 0) + 1;
    localStorage.setItem(KEY_WISHES, JSON.stringify(cur));
    return cur;
  }
};
