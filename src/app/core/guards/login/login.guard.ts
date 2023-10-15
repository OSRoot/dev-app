// import { ActivatedRouteSnapshot, CanActivateFn, RouterStateSnapshot } from '@angular/router';
// import { filter, take, map } from 'rxjs';

// export const loginGuard: CanActivateFn = (route:ActivatedRouteSnapshot, state:RouterStateSnapshot) => {
//   return this.auth.isAuthenticated.pipe(
//     filter(BH_VALUE=> BH_VALUE!==null),
//     take(1),
//     map(isAuthenticated=>{
//     console.log('Map in CanLLoad: ',isAuthenticated);

//       if(isAuthenticated){
//         return true
//       }
//       else{
//         console.log(isAuthenticated);
//         this.router.navigateByUrl('/login',{replaceUrl:true});
//         return false
//       }
//     })
//   );
// };
// // ''const canActivateTeam: CanActivateFn =
// // (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
// //   return inject(PermissionsService).canActivate(inject(UserToken), route.params.id);
// // };
