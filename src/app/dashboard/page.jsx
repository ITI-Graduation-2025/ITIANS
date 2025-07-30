"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { Users, Briefcase, GraduationCap, TrendingUp } from "lucide-react";
import { mockAnalytics } from "@/lib/mock-data";
import Link from "next/link";
import { getAllUsers } from "@/services/firebase";
import {
  getAllSpecificValueInsideArray,
  getAllValueInsideArray,
  getArrayFromValue,
  getUniqueValues,
} from "@/utils/arrayUtils";
import { array } from "zod";
import { useContext, useEffect, useState } from "react";

export default function Dashboard() {
  const {
    totalUsers,
    activeJobs,
    mentorshipSessions,
    recentActivity,
    userGrowth,
  } = mockAnalytics;

  const [users, setUsers] = useState([]);
  // const [users, setUsers] = useContext();
  const [roles, setRoles] = useState([]);
  const [freelancers, setFreelancers] = useState([]);
  const [mentor, setMentor] = useState([]);
  const [company, setCompany] = useState([]);
  // console.log(users);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const totalUsersData = await getAllUsers();
        setUsers(totalUsersData);
        const roles = await getAllSpecificValueInsideArray(
          totalUsersData,
          "role",
        );
        setRoles(roles);
        const freelancers = getArrayFromValue(
          totalUsersData,
          "role",
          "freelancer",
        );
        setFreelancers(freelancers);
        const mentor = getArrayFromValue(totalUsersData, "role", "mentor");
        setMentor(mentor);
        const company = getArrayFromValue(totalUsersData, "role", "company");
        setCompany(company);
      } catch (error) {
        console.log("خطأ في جلب البيانات:", error);
      }
    };

    fetchData();
  }, []);

  // console.log(users, roles, freelancers, mentor, company);
  return (
    <div className="flex flex-1 flex-col">
      <div className="flex-1 space-y-4 p-4 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <Button asChild>
            <Link href="/analytics">View Detailed Analytics</Link>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Freelancers
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{freelancers.length}</div>
              <p className="text-xs text-muted-foreground">
                +12% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Companies
              </CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{company.length}</div>
              <p className="text-xs text-muted-foreground">
                +8% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Mentors
              </CardTitle>
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mentor.length}</div>
              <p className="text-xs text-muted-foreground">
                +3% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeJobs}</div>
              <p className="text-xs text-muted-foreground">
                +5% from last month
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-8">
          {/* User Growth Chart */}

          {/* Recent Activity */}
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest platform activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {activity.user}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Mentorship Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{mentorshipSessions}</div>
              <p className="text-sm text-muted-foreground">
                Total sessions booked
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Platform Matches</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">234</div>
              <p className="text-sm text-muted-foreground">
                Successful freelancer hires
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Active Chats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">67</div>
              <p className="text-sm text-muted-foreground">
                Ongoing conversations
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
