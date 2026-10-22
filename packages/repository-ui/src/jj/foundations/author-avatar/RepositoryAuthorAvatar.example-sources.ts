export const Basic =
  '<script lang="ts">\n  import { RepositoryAuthorAvatar } from "@lapismd/repository-ui/jj";\n  let { avatarUrl }: { avatarUrl?: string } = $props();\n</script>\n<RepositoryAuthorAvatar name="Lapis developer" email="dev@lapis.md" avatarUrl={avatarUrl} size="lg" />';
export const Styling =
  '<script lang="ts">\n  import { RepositoryAuthorAvatar } from "@lapismd/repository-ui/jj";\n  let { avatarUrl }: { avatarUrl?: string } = $props();\n</script>\n<div style="--ui-repository-author-avatar-size:2.5rem">\n  <RepositoryAuthorAvatar name="Lapis developer" email="dev@lapis.md" avatarUrl={avatarUrl} size="lg" />\n</div>';

export const HostResolver =
  '<script lang="ts">\n  import {RepositoryAuthorAvatar, provideRepositoryAuthorAvatars} from "@lapismd/repository-ui/jj";\n  let {urls}:{urls:Readonly<Record<string,string>>}=$props();\n  provideRepositoryAuthorAvatars(email=>urls[email]);\n</script>\n<RepositoryAuthorAvatar name="Lapis developer" email="dev@lapis.md" />';
