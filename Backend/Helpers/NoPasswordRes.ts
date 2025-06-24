export const userWithoutPassword = (user: any) => {
    const { password: _, ...rest } = user; // Destructure to exclude 'password'
    return rest;
};