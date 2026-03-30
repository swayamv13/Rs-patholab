import React, { useState, useContext, useEffect } from 'react';
import { assets } from '../assets/assets';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'

const MyProfile = () => {
  // Use direct values from context for reading, local state for editing
  const { userData, setUserData, token, familyMembers, addFamilyMember, backendUrl } = useContext(AppContext);
  const navigate = useNavigate();

  const [isEdit, setIsEdit] = useState(false);

  // Local state for THE EDIT FORM only
  const [localData, setLocalData] = useState({
    name: "",
    image: assets.profile_pic,
    email: '',
    phone: '',
    address: {
      line1: "",
      line2: ""
    },
    gender: 'Male',
    dob: ''
  });

  // Sync local form data with Context User Data when it loads
  useEffect(() => {
    if (userData) {
      setLocalData({
        name: userData.name || '',
        email: userData.email || '',
        phone: userData.phone || '',
        address: userData.address || { line1: '', line2: '' },
        gender: userData.gender || 'Male',
        dob: userData.dob || ''
      });
    }
  }, [userData]);

  const handleSaveProfile = async () => {
    if (!token) return;
    try {
      const { data } = await axios.put(backendUrl + '/api/user/profile', localData, { headers: { token } });
      if (data.success) {
        setUserData({ ...userData, ...localData }); // Update context
        setIsEdit(false);
        toast.success("Profile Updated Successfully!");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(error.message || "Failed to update profile.");
    }
  };

  // Add Member State
  const [showAddMember, setShowAddMember] = useState(false);
  const [newMember, setNewMember] = useState({ name: '', relation: '', age: '', gender: 'Male' });

  const handleAddMemberSubmit = async (e) => {
    e.preventDefault();
    if (!newMember.name || !newMember.age) return;

    await addFamilyMember(newMember);
    setNewMember({ name: '', relation: '', age: '', gender: 'Male' });
    setShowAddMember(false);
  };

  if (!token) {
    return (
      <div className='min-h-[60vh] flex flex-col items-center justify-center'>
        <h2 className='text-2xl font-bold text-gray-700 mb-4'>Please Login to View Profile</h2>
        <button onClick={() => navigate('/login')} className='bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-primary-dark transition-colors'>
          Login Now
        </button>
      </div>
    )
  }

  return (
    <div className='bg-gray-50 min-h-screen py-10 section-padding'>
      <div className='max-w-4xl mx-auto flex flex-col gap-6 text-sm'>

        {/* PROFILE CARD */}
        <div className='bg-white rounded-2xl shadow-md p-8 border border-gray-100 flex flex-col md:flex-row gap-8 items-start'>
          {/* Avatar Section */}
          <div className='flex flex-col items-center gap-4'>
            <div className='w-32 h-32 rounded-full overflow-hidden border-4 border-blue-50 relative group'>
              <img className='w-full h-full object-cover' src={userData?.image || assets.profile_pic} alt="" />
              {isEdit && (
                <div className='absolute inset-0 bg-black/50 flex items-center justify-center text-white cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity'>
                  <span>📷</span>
                </div>
              )}
            </div>
            {isEdit ? (
              <button onClick={handleSaveProfile} className='bg-blue-600 text-white px-6 py-2 rounded-full font-bold shadow-lg hover:bg-blue-700 transition-all'>Save Profile</button>
            ) : (
              <button onClick={() => setIsEdit(true)} className='bg-white text-blue-600 border border-blue-200 px-6 py-2 rounded-full font-bold hover:bg-blue-50 transition-all'>Edit Profile</button>
            )}
          </div>

          {/* Details Section */}
          <div className='flex-1 w-full'>
            {isEdit ? (
              <input className='bg-gray-50 text-3xl font-bold text-gray-900 mb-4 w-full p-2 rounded-lg border border-gray-200 focua:border-blue-500 outline-none' type="text" value={localData.name} onChange={e => setLocalData(prev => ({ ...prev, name: e.target.value }))} />
            ) : (
              <p className='text-3xl font-bold text-gray-900 mb-4'>{localData.name}</p>
            )}

            <hr className='bg-gray-200 h-[1px] border-none my-6' />

            <div className='grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12'>
              <div>
                <p className='text-gray-400 font-medium mb-1 uppercase text-xs tracking-wider'>Contact Info</p>
                <div className='space-y-4 pt-2'>
                  <div className='flex flex-col'>
                    <span className='font-medium text-gray-500 text-xs'>Email ID:</span>
                    {isEdit ?
                      <input className='bg-gray-50 p-2 rounded border mt-1' type="text" value={localData.email} onChange={e => setLocalData(prev => ({ ...prev, email: e.target.value }))} />
                      : <p className='text-blue-600 font-medium'>{localData.email}</p>
                    }
                  </div>
                  <div className='flex flex-col'>
                    <span className='font-medium text-gray-500 text-xs'>Phone:</span>
                    {isEdit ?
                      <input className='bg-gray-50 p-2 rounded border mt-1' type="text" value={localData.phone} onChange={e => setLocalData(prev => ({ ...prev, phone: e.target.value }))} />
                      : <p className='text-blue-600 font-medium'>{localData.phone}</p>
                    }
                  </div>
                </div>
              </div>

              <div>
                <p className='text-gray-400 font-medium mb-1 uppercase text-xs tracking-wider'>Address Info</p>
                <div className='space-y-2 pt-2'>
                  {isEdit ? (
                    <div className='space-y-2'>
                      <input className='bg-gray-50 p-2 rounded border w-full' placeholder="Line 1" onChange={(e) => setLocalData(prev => ({ ...prev, address: { ...prev.address, line1: e.target.value } }))} value={localData.address.line1} type="text" />
                      <input className='bg-gray-50 p-2 rounded border w-full' placeholder="Line 2" onChange={(e) => setLocalData(prev => ({ ...prev, address: { ...prev.address, line2: e.target.value } }))} value={localData.address.line2} type="text" />
                    </div>
                  ) : (
                    <p className='text-gray-600 font-medium'>
                      {localData.address.line1 || 'Add Address'}<br />
                      {localData.address.line2}
                    </p>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* FAMILY MEMBERS SECTION */}
        <div className='bg-white rounded-2xl shadow-md p-8 border border-gray-100'>
          <div className='flex justify-between items-center mb-6'>
            <h2 className='text-xl font-bold text-gray-800 flex items-center gap-2'>
              <span>👨‍👩‍👧‍👦</span> Family Members
            </h2>
            <button
              onClick={() => setShowAddMember(!showAddMember)}
              className='bg-blue-50 text-blue-700 px-4 py-2 rounded-lg font-bold text-sm hover:bg-blue-100 transition-colors'
            >
              {showAddMember ? 'Cancel' : '+ Add Member'}
            </button>
          </div>

          {/* Members List */}
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6'>
            {familyMembers && familyMembers.length > 0 ? (
              familyMembers.map((member) => (
                <div key={member.id} className='border border-gray-200 rounded-xl p-4 flex items-center gap-4 bg-gray-50/50 hover:bg-white hover:shadow-md transition-all'>
                  <div className='w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-xl'>
                    {member.gender === 'Male' ? '👨' : '👩'}
                  </div>
                  <div>
                    <p className='font-bold text-gray-800'>{member.name}</p>
                    <p className='text-xs text-gray-500'>{member.relation} • {member.age} Yrs • {member.gender}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className='text-gray-500 text-sm col-span-full italic'>No family members added yet.</p>
            )}
          </div>

          {/* Add Member Form */}
          {showAddMember && (
            <div className='bg-blue-50/50 rounded-xl p-6 border border-blue-100 animate-fade-in-up'>
              <h3 className='font-bold text-gray-800 mb-4'>Add New Family Member</h3>
              <form onSubmit={handleAddMemberSubmit} className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end'>
                <div>
                  <label className='block text-xs font-bold text-gray-500 mb-1'>Name</label>
                  <input required type="text" className='w-full px-3 py-2 rounded border border-gray-200 outline-none focus:border-blue-500'
                    value={newMember.name} onChange={e => setNewMember({ ...newMember, name: e.target.value })} placeholder="Ex: Rahul" />
                </div>
                <div>
                  <label className='block text-xs font-bold text-gray-500 mb-1'>Relation</label>
                  <input required type="text" className='w-full px-3 py-2 rounded border border-gray-200 outline-none focus:border-blue-500'
                    value={newMember.relation} onChange={e => setNewMember({ ...newMember, relation: e.target.value })} placeholder="Ex: Brother" />
                </div>
                <div>
                  <label className='block text-xs font-bold text-gray-500 mb-1'>Age</label>
                  <input required type="number" className='w-full px-3 py-2 rounded border border-gray-200 outline-none focus:border-blue-500'
                    value={newMember.age} onChange={e => setNewMember({ ...newMember, age: e.target.value })} placeholder="Ex: 25" />
                </div>
                <div>
                  <label className='block text-xs font-bold text-gray-500 mb-1'>Gender</label>
                  <select className='w-full px-3 py-2 rounded border border-gray-200 outline-none focus:border-blue-500'
                    value={newMember.gender} onChange={e => setNewMember({ ...newMember, gender: e.target.value })}>
                    <option>Male</option>
                    <option>Female</option>
                  </select>
                </div>
                <button type="submit" className='bg-blue-600 text-white font-bold py-2 rounded shadow-lg hover:bg-blue-700 transition-colors h-[38px]'>
                  Add
                </button>
              </form>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

export default MyProfile