export class AppNavigation{
 constructor({history,restore,closeDialog,isBusy,onRoot}){Object.assign(this,{history,restore,closeDialog,isBusy,onRoot});this.uid=null;this.route=null;this.modal=false;this.pending=null;this.afterClose=null;this.closing=false;this.restoring=false;}
 state(route,extra={}){return {kongsipayNavigation:1,uid:this.uid,route,...extra};}
 start(uid,route){this.uid=uid;this.route=route;this.modal=false;this.pending=null;this.afterClose=null;this.closing=false;this.history.replaceState(this.state(route,{root:true}),'');this.history.pushState(this.state(route),'');}
 stop(){this.uid=null;this.route=null;this.modal=false;this.pending=null;this.afterClose=null;this.closing=false;}
 same(a,b){return JSON.stringify(a)===JSON.stringify(b);}
 sync(route){if(!this.uid||this.restoring||this.same(route,this.route))return;this.route=route;if(this.modal)this.history.replaceState(this.state(route,{modal:true}),'');else this.history.pushState(this.state(route),'');}
 openDialog(route){if(!this.uid)return;this.closing=false;this.route=route;if(this.modal)this.history.replaceState(this.state(route,{modal:true}),'');else{this.modal=true;this.history.pushState(this.state(route,{modal:true}),'');}}
 afterDialog(action){if(this.closing)return;if(!this.modal){this.closeDialog();action();return;}this.afterClose=action;this.dismissDialog();}
 dismissDialog(route){if(this.closing)return;if(!this.modal){this.closeDialog();return;}this.closing=true;this.pending=route||null;this.history.back();}
 pop(state){if(!this.uid)return;if(this.isBusy()){this.history.forward();return;}this.closeDialog();this.modal=false;this.closing=false;if(!state||state.kongsipayNavigation!==1||state.uid!==this.uid){this.start(this.uid,this.route);return;}const pending=this.pending,action=this.afterClose;this.pending=null;this.afterClose=null;this.route=state.route;this.restoring=true;try{this.restore(state.route);}finally{this.restoring=false;}if(state.modal)this.history.replaceState(this.state(state.route),'');if(action){action();}else if(pending&&!this.same(pending,state.route)){this.restore(pending);this.sync(pending);}else if(state.root)this.onRoot();}
}
