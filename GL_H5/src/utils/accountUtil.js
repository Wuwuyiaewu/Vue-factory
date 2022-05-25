import Util from './tradeDataUtil'
export default {

  // initData: function(para, Account) {
  //   Account.accountID = para.AccountID
  //   if (para.Token) Account.token = para.Token
  //   Account.companyId = para.CompanyID
  //   Account.groupId = para.GroupID
  //   Account.id = para.LastLoginAccountId
  //   Account.userId = para.UserID
  //   Account.loginName = para.LoginName
  //   Account.closeOnly = para.CloseOnly
  //   Account.balance = Util.fixToStr(para.Balance, 2)
  //   Account.equity = Util.fixToStr(para.Equity, 2)
  //   Account.available = Util.fixToStr(para.FreeMargin, 2)
  //   Account.take = Util.fixToStr(para.Margin, 2)
  //   Account.marginStopout = Util.fixToStr(para.MarginStopout, 2)
  //   Account.marginMaintenance = para.MarginMaintenance // 维持保证金
  // },
  initData: function(para, Account) {
    Account.accountID = para.AccountID;
    Account.accountNo = para.AccountNo;
    Account.activeTime = para.ActiveTime; //seems to be createdDate
    Account.balance = Util.fixToStr(para.Balance, 2);
    Account.bonus = para.Bonus;
    Account.closeOnly = para.CloseOnly;
    Account.code = para.Code;
    Account.companyId = para.CompanyID;
    Account.credit = para.Credit;
    Account.equity = Util.fixToStr(para.Equity, 2)
    Account.freeBalance = para.FreeBalance;
    Account.freeMargin = Util.fixToStr(para.FreeMargin, 2)
    Account.frozen = para.Frozen;
    Account.groupId = para.GroupID;
    Account.lastDealId = para.LastDealID;
    Account.lastLoginAccountId = para.LastLoginAccountId;
    Account.lastLoginTime = para.LastLoginTime;
    Account.lastOrderTime = para.LastOrderTime;
    Account.loginName = para.LoginName;
    Account.margin = Util.fixToStr(para.Margin, 2)
    Account.marginLevel = para.MarginLevel;
    Account.marginMaintenance = para.MarginMaintenance;
    Account.marginStopout = Util.fixToStr(para.MarginStopout, 2)
    Account.platform = para.Platform;
    Account.positions = para.Positions;
    Account.status = para.Status;
    if (para.Token) Account.token = para.Token;
    Account.userID = para.UserID;
    Account.volumeMax = para.VolumeMax;
    Account.volumes = para.Volumes;
    Account.take = Util.fixToStr(para.Margin, 2);
    Account.available = Util.fixToStr(para.FreeMargin, 2);
    Account.id = para.LastLoginAccountId;
  },

  updateData: function(para, Account) {
    Account.closeOnly = para.CloseOnly
    Account.balance = Util.fixToStr(para.Balance, 2)
    Account.equity = Util.fixToStr(para.Equity, 2)
    Account.available = Util.fixToStr(para.FreeMargin, 2)
    Account.take = Util.fixToStr(para.Margin, 2)
    Account.marginLevel = Util.fixToStr(para.MarginLevel, 2)
    Account.marginStopout = Util.fixToStr(para.MarginStopout, 2)
    Account.marginMaintenance = para.MarginMaintenance
  },

  initGroup: function(para, Group) {
    Group.serverId = para.ServerID
    Group.groupName = para.GroupName
    Group.currency = para.Currency.toUpperCase()
    Group.volumesMax = para.VolumesMax
    Group.orderMax = para.OrderMax
    Group.enable = para.Enable
    Group.marginType = para.MarginType
    if (Group.currency != 'USD') { // 非美元账户
      Group.midSymbol = 'USD' + Group.currency
    }
  },

  updateGroup: function(para, Group) {
    Group.serverId = para.ServerID
    Group.currency = para.Currency.toUpperCase()
    Group.volumesMax = para.VolumesMax
    Group.orderMax = para.OrderMax
    Group.enable = para.Enable
    Group.marginType = para.MarginType
    if (Group.currency != 'USD') { // 非美元账户
      Group.midSymbol = 'USD' + Group.currency
    }
  }
}
