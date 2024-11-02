function showSalary(users, age){
   let selectedUsers = '';
   for (let i = 0; i < users.length; i++) {
      if(users[i].age <= age){
         selectedUsers += `${users[i].name}, ${users[i].balance}\n`;
      }
   }
   return selectedUsers.substring(0, selectedUsers.length - 1);
}