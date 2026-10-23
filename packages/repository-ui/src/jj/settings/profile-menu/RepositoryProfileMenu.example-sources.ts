export const Basic =
  "<script lang=\"ts\">\nimport {RepositoryProfileMenu,type PersonalProfile} from '@lapismd/repository-ui/settings';\nlet {profile,avatarUrl,onProfile,onSettings}:{profile:PersonalProfile;avatarUrl?:string;onProfile():void;onSettings():void}=$props();\n</script>\n<RepositoryProfileMenu {profile} {avatarUrl} {onProfile} {onSettings}/>\n";
export const Styling =
  '<script lang="ts">\nimport {RepositoryProfileMenu,type PersonalProfile} from \'@lapismd/repository-ui/settings\';\nlet {profile,avatarUrl,onProfile,onSettings}:{profile:PersonalProfile;avatarUrl?:string;onProfile():void;onSettings():void}=$props();\n</script>\n<div style="--ui-repository-profile-menu-width:14rem">\n<RepositoryProfileMenu {profile} {avatarUrl} {onProfile} {onSettings}/>\n</div>\n';
