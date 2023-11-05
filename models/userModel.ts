const database: Express.User[] = [
  {
    id: 1,
    name: "Jimmy Smith",
    email: "jimmy123@gmail.com",
    password: "jimmy123!",
    githubId: "", 
    role: 'admin',
  },
  {
    id: 2,
    name: "Johnny Doe",
    email: "johnny123@gmail.com",
    password: "johnny123!",
  },
  {
    id: 3,
    name: "Jonathan Chen",
    email: "jonathan123@gmail.com",
    password: "jonathan123!",
  },
];

const userModel = {

  /* FIX ME (types) 😭 */
  findOne: (email: string) => {
    const user = database.find((user) => user.email === email);
    if (user) {
      return user;
    }
    throw new Error(`Couldn't find user with email: ${email}`);
  },
  /* FIX ME (types) 😭 */
  findById: (id: number) => {
    const user = database.find((user) => user.id === id);
    if (user) {
      return user;
    }
    throw new Error(`Couldn't find user with id: ${id}`);
  },
  findOneByGitHubId: (githubId: string) => {
    return database.find(user => user.githubId === githubId);
  },
  addUser: (userData: { githubId: string; name: string; email: string;}) => {
    const newUser: Express.User = {
      id: database.length + 1, 
      name: userData.name,
      email: userData.email,
      password: '', 
      githubId: userData.githubId,
      role: 'user',
    };
    database.push(newUser);
    return newUser;
  },
  isAdmin: (userId: number): boolean => {
    const user = userModel.findById(userId);
    return user?.role === 'admin';
  },
};


export { database, userModel };
