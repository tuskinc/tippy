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
      return createOkNoData();
    },
    async signUp({ email }: { email: string; password: string; options?: { data?: unknown } }) {
      currentSession = {
        access_token: "demo_token",
        token_type: "bearer",
        user: { id: randomId(), email },
      };
      return createOkNoData();
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
  from(_table: string) {
    return {
      select: async () => createOk<any[]>([]),
      insert: async (_values: unknown) => createOkNoData(),
      update: async (_values: unknown) => createOkNoData(),
      delete: async () => createOkNoData(),
      eq: function () {
        return this;
      },
      order: function () {
        return this;
      },
      limit: function () {
        return this;
      },
    };
  },
};




