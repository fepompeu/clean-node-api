export interface Authentication{
  auth: ({ email, password }: {email: string, password: string}) => Promise<string>
}
