import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FiUser, FiMail, FiMapPin, FiPhone, FiEdit, FiSave, FiX } from 'react-icons/fi';

export const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: 'John Doe',
      email: 'john.doe@example.com',
      location: 'New York, NY',
      phone: '(555) 123-4567',
      bio: 'Active community member interested in local events and volunteering opportunities.'
    }
  });

  const onSubmit = (data) => {
    console.log(data);
    // TODO: Update user profile in database
    setIsEditing(false);
  };

  return (
    <>
      <div className="mb-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">My Profile</h1>
          {!isEditing ? (
            <button 
              onClick={() => setIsEditing(true)} 
              className="btn btn-outline"
            >
              <FiEdit className="mr-1" /> Edit Profile
            </button>
          ) : (
            <div className="flex space-x-2">
              <button onClick={() => setIsEditing(false)} className="btn btn-outline">
                <FiX className="mr-1" /> Cancel
              </button>
              <button 
                form="profile-form" 
                type="submit" 
                className="btn btn-primary"
              >
                <FiSave className="mr-1" /> Save
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <div className="card text-center py-8">
            <div className="relative w-32 h-32 mx-auto mb-6 rounded-full bg-primary bg-opacity-10 flex items-center justify-center">
              <FiUser className="text-6xl text-primary" />
              {isEditing && (
                <div className="absolute inset-0 flex items-center justify-center bg-dark bg-opacity-70 rounded-full">
                  <button className="text-primary hover:text-white">
                    <FiEdit size={24} />
                  </button>
                </div>
              )}
            </div>
            <h2 className="text-2xl font-semibold mb-1">John Doe</h2>
            <p className="text-muted">Member since May 2025</p>
            
            <div className="mt-6 space-y-2 text-left px-4">
              <div className="flex items-center text-muted">
                <FiMail className="mr-2" /> john.doe@example.com
              </div>
              <div className="flex items-center text-muted">
                <FiMapPin className="mr-2" /> New York, NY
              </div>
              <div className="flex items-center text-muted">
                <FiPhone className="mr-2" /> (555) 123-4567
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="card h-full">
            {!isEditing ? (
              <>
                <h2 className="text-2xl font-semibold mb-6">About Me</h2>
                <p className="text-muted">
                  Active community member interested in local events and volunteering opportunities.
                </p>
                
                <div className="mt-8">
                  <h3 className="text-xl font-medium mb-4">Recent Activity</h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-dark bg-opacity-30 rounded-lg">
                      <p className="text-sm text-primary mb-1">2 days ago</p>
                      <p>Registered for "Community Gathering" event</p>
                    </div>
                    <div className="p-4 bg-dark bg-opacity-30 rounded-lg">
                      <p className="text-sm text-primary mb-1">5 days ago</p>
                      <p>Posted in "General Discussion" forum</p>
                    </div>
                    <div className="p-4 bg-dark bg-opacity-30 rounded-lg">
                      <p className="text-sm text-primary mb-1">1 week ago</p>
                      <p>Created a new thread: "Ideas for the Summer Festival"</p>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <form id="profile-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <h2 className="text-2xl font-semibold mb-6">Edit Profile</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-muted mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      className="block w-full px-3 py-2 bg-dark border border-accent rounded-md focus:ring-1 focus:ring-primary focus:border-primary"
                      {...register("name", { required: "Name is required" })}
                    />
                    {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-muted mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      className="block w-full px-3 py-2 bg-dark border border-accent rounded-md focus:ring-1 focus:ring-primary focus:border-primary"
                      {...register("email", { 
                        required: "Email is required",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Invalid email address"
                        }
                      })}
                    />
                    {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-muted mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      className="block w-full px-3 py-2 bg-dark border border-accent rounded-md focus:ring-1 focus:ring-primary focus:border-primary"
                      {...register("location")}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-muted mb-1">
                      Phone
                    </label>
                    <input
                      type="text"
                      className="block w-full px-3 py-2 bg-dark border border-accent rounded-md focus:ring-1 focus:ring-primary focus:border-primary"
                      {...register("phone")}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-muted mb-1">
                    Bio
                  </label>
                  <textarea
                    rows={5}
                    className="block w-full px-3 py-2 bg-dark border border-accent rounded-md focus:ring-1 focus:ring-primary focus:border-primary"
                    {...register("bio")}
                  />
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
