import { useTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { UserPublications } from '/imports/api/users';

export const useAuth = () => {
  return useTracker(() => {
    // Subscribe to user data if logged in
    const userDataHandle = Meteor.userId() ? Meteor.subscribe(UserPublications.userData) : null;
    
    const user = Meteor.user();
    const isLoading = Meteor.loggingIn() || (userDataHandle && !userDataHandle.ready());
    const isLoggedIn = !!user && !isLoading;
    const isAdmin = user?.profile?.role === 'admin';

    return {
      user,
      isLoading,
      isLoggedIn,
      isAdmin,
      userId: Meteor.userId()
    };
  }, []);
};
