// Lightweight in-memory Supabase mock for demo mode (no network required)
type Session = {
  access_token: string;
  token_type: string;
  user: { id: string; email: string };
} | null;

let currentSession: Session = null;

function createOk<T>(data: T) {
  return Promise.resolve({ data, error: null } as { data: T; error: null });
}

function createOkNoData() {
  return Promise.resolve({ error: null } as { error: null });
}

function randomId(prefix = "usr_") {
  return prefix + Math.random().toString(36).slice(2, 10);
}

export const supabase: any = {
  auth: {
    async getSession() {
      return createOk<{ session: Session }>({ session: currentSession });
    },
    async getUser() {
      return createOk<{ user: Session extends { user: infer U } ? U : null }>({
        // @ts-expect-error - simple mock typing
        user: currentSession ? currentSession.user : null,
      });
    },
    async signInWithPassword({ email }: { email: string; password: string }) {
      currentSession = {
        access_token: "demo_token",
        token_type: "bearer",
        user: { id: randomId(), email },
      };
      return createOk<{ user: { id: string; email: string } | null; session: Session }>({
        user: currentSession ? currentSession.user : null,
        session: currentSession,
      });
    },
    async signUp({ email }: { email: string; password: string; options?: { data?: unknown } }) {
      currentSession = {
        access_token: "demo_token",
        token_type: "bearer",
        user: { id: randomId(), email },
      };
      return createOk<{ user: { id: string; email: string } | null; session: Session }>({
        user: currentSession ? currentSession.user : null,
        session: currentSession,
      });
    },
    async signOut() {
      currentSession = null;
      return createOkNoData();
    },
    onAuthStateChange(callback: (_event: string, session: Session) => void) {
      // Immediately emit current state, and return simple unsubscribe
      setTimeout(() => callback("INITIAL_SESSION", currentSession), 0);
      return { data: { subscription: { unsubscribe: () => {} } } };
    },
    async updateUser() {
      return createOkNoData();
    },
  },
  from(table: string) {
    const builder: any = {
      _table: table,
      _select: '*',
      _filters: [] as Array<{ column: string; op: string; value: unknown }>,
      _orderBy: null as string | null,
      _orderOpts: {} as unknown,
      _limit: null as number | null,
      select(this: any, columns = '*') {
        this._select = columns;
        return this;
      },
      eq(this: any, column: string, value: unknown) {
        this._filters.push({ column, op: 'eq', value });
        return this;
      },
      order(this: any, column: string, opts?: unknown) {
        this._orderBy = column;
        this._orderOpts = opts || {};
        // Resolve with an empty dataset shaped like Supabase response
        return createOk<any[]>([]);
      },
      limit(this: any, n: number) {
        this._limit = n;
        return this;
      },
      insert: async (_values: unknown) => createOkNoData(),
      update: async (_values: unknown) => createOkNoData(),
      delete: async () => createOkNoData(),
    };
    return builder;
  },
};




